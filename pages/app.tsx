import React, { useContext, useEffect, useState } from "react";
import styles from '../styles/app.module.css'
import Link from "next/link";
import HyphaLogo from "../public/logo/hypha-01.svg"
import Cog from "../public/fa/cog.svg"

import { useEthers } from "@usedapp/core";

import { ConnectButton } from "../components/ConnectButton";
import { Message } from "../components/Message";
import { Conversation } from "../components/Conversation";
import { SendMessage } from "../components/SendMessage";
import { ConversationModal } from "../components/ConversationModal";
import { Settings } from "../components/Settings";
import { Tooltip } from "../components/utils/Tooltip";

import { EthereumAuthProvider, SelfID } from '@self.id/web';
import getOrCreateMessageStream, { streamr, HyphaType } from "../services/Streamr_API"
import { Conversations, MessageData } from "../components/utils/Types";
import { GetStaticProps } from "next";
import useMetadata from "../components/hooks/useMetadata";
import { Stream } from "streamr-client";
import useConversationStorage, { localStreamKey } from "../components/hooks/useConversationStorage"

import { DispatchContext, StateContext } from "../components/context/AppState";
import { Actions } from "../components/context/AppContextTypes";

function App({ data }) {
  const { account, activateBrowserWallet, deactivate, chainId } = useEthers();

  //Global State
  const { selfId, profile, notifications, conversations } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  //Component Constructors
  const [conversationModal, setConversationModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [searchKey, setSearchKey] = useState<string>('');

  const getSelectedConversation = () => {
    return conversations.find((conversation) => conversation.selected)
    ? conversations.find((conversation) => conversation.selected)
    : { address: "", streamID: "", selected: false };
  }

  const [metadata, setMetadata] = useMetadata(getSelectedConversation());
  const { ceramicConversations, ceramicStream } = useConversationStorage();

  useEffect(() => {
    const connect = async () => {
      try{
        await streamr.connect()
        const selfIdClient = await SelfID.authenticate({
          //@ts-ignore
          authProvider: new EthereumAuthProvider(window.ethereum, account),
          ceramic: 'testnet-clay',
          connectNetwork: 'testnet-clay',
        })
        dispatch({ type: Actions.SET_SELFID, payload: selfIdClient });
        dispatch({ type: Actions.SET_PROFILE, payload: await selfIdClient.get('basicProfile') });
      }
      catch{
        console.log("User needs an Ethereum wallet to connect to Hypha.");
      }
    }
    if(account){
      connect();
      dispatch({ type: Actions.SET_ACCOUNT, payload: account });
    }
  }, [account])

  //Connects ethereum wallet to Hypha
  const connect = async () => {
    activateBrowserWallet();
    console.log("The client attempted to connect");
  };

  //Disconnects wallet and removes all data from window
  const disconnect = async () => {
    deactivate();
    console.log("The client has been disconnected");
    notifications.forEach(notification => {
      notification.close();
    });
    setSearchKey('');
    setMetadata(undefined);
    dispatch({ type: Actions.CLEAR_STATE })
  };

  useEffect(() => {
    async function loadConversations(){
      //Add conversation user profiles to object
      const newConversations = await Promise.all(ceramicConversations.map(async (conversation) => {
        try{
          conversation.profile = await selfId.client.get('basicProfile', `${conversation.address}@eip155:${chainId}`);
        }
        catch(e){
          console.warn(`There is no DID that exists for ${conversation.address}`);
        }
        return conversation;
      }));
      //Set valid streams if any conversations don't have one
      if(newConversations.some(conversation => conversation.streamID === '' || conversation.streamID === undefined)) await setAllValidStreams(newConversations);
      //Subscribe if conversations don't have empty/null streamIDs
      if(newConversations.filter(conversation => conversation.streamID === '' || conversation.streamID === undefined).length === 0) await subscribeToConversations(newConversations);
      dispatch({ type: Actions.SET_CONVERSATIONS, payload: newConversations });
    }
    if(selfId && ceramicConversations?.length > 0){
      loadConversations();
      setMetadata(oldMetadata => ({...oldMetadata, online: true}));
    }
  }, [selfId, ceramicConversations])

  const subscribeToConversations = async (_conversations: Conversations[]) => {
    const subs = await streamr.getSubscriptions();
    //Subscribe to stream after messages were resent
    await Promise.all(_conversations.map(async (conversation) => {
      //Check if conversation streamID is empty & check if we are already subscribed
      if(conversation.streamID !== "" && subs.length === 0){
        await streamr.subscribe(
          {
            stream: conversation.streamID,
            partition: 0,
          }, (data: MessageData) => {
            //Create a new notification if the new message was not sent by us & interface is not visible
            if(data.sender !== account && document.visibilityState !== "visible"){
              const name = getSelectedConversation().profile?.name ? getSelectedConversation().profile?.name : data.sender;
              const image = getSelectedConversation().profile?.image?.alternatives[0].src ? `https://ipfs.io/ipfs/${getSelectedConversation().profile.image.alternatives[0].src?.substring(7, getSelectedConversation().profile.image.alternatives[0].src?.length)}` : `https://robohash.org/${data.sender}.png?set=set5`;
              const notification = new Notification(`${name} sent you a message!`, {body: data.message, icon: image});
              dispatch({ type: Actions.ADD_NOTIFICATION, payload: notification });
            }
            const newConversations = _conversations.map((e) => {
              if(conversation.address === e.address){
                if(e.messages){
                  e.messages = [...e.messages, data];
                }
                else{
                  e.messages = [data];
                }
              }
              return e;
            })
            dispatch({ type: Actions.SET_CONVERSATIONS, payload: newConversations });
          }
        )
      }
    }))
  }
  
  const getValidStream = async (_conversation: Conversations) => {
    try{
      const streams: Stream[] = [];
      //Check if either conversation has a stream
      for await(const stream of streamr.searchStreams(_conversation.address, { user: account, allowPublic: true })){
        streams.push(stream);
      }
      for await(const stream of streamr.searchStreams(account, { user: _conversation.address, allowPublic: true })){
        streams.push(stream);
      }
      //Return found stream
      if(streams.length !== 0) return streams[0];
      //Create a new stream since none were found
      const newStream = await getOrCreateMessageStream(_conversation.address, HyphaType.Hypha, false);
      return newStream;
    }
    catch(e){
      console.warn(e);
    }
  }

  const setValidStream = async (_conversation: Conversations) => {
    const validStream = await getValidStream(_conversation);
    const newConversations: Conversations[] = ceramicConversations.map((e) => {
      if(_conversation.address === e.address){
        e.streamID = validStream.id;
      }
      return e;
    });
    dispatch({ type: Actions.SET_CONVERSATIONS, payload: newConversations });
    await ceramicStream.update({conversations: [...newConversations]});
  }

  const setAllValidStreams = async (_conversations: Conversations[]) => {
    //Check if any of the conversations have empty or undefined streamIDs
    if(_conversations.filter(conversation => conversation.streamID === "" || conversation.streamID === undefined).length > 0){
      Promise.all(_conversations.map(conversation => {
        return new Promise<void>((resolve) => {
          setValidStream(conversation);
          resolve();
        });
      }));
    }
  }

  async function addConversations(_address: string){
    //Check if conversation exists already
    if(!ceramicConversations?.some(conversation => conversation.address === _address)){
      const validStream = await getValidStream({ address: _address, selected: false, streamID: undefined });
      console.log(validStream);
      const newConversation = {
        address: _address,
        streamID: validStream.id,
        selected: false,
      }
      //Create a new conversations stream if there are no previously existing streams & pin it
      if(ceramicConversations){
        await ceramicStream.update({conversations: [...ceramicConversations, newConversation]})
      }
      else{
        const stream = await selfId.client.tileLoader.create(
          {
            conversations: [newConversation]
          },
          {
            tags: ['conversations'],
          },
          {
            pin: true,
          }
        );
        //Add a new local storage record of the stream ID
        window.localStorage.setItem(`${account}-${localStreamKey}`, stream.id.toString());
      }
      dispatch({ type: Actions.ADD_CONVERSATION, payload: newConversation });
    }
  }

  async function deleteConversation(_conversation: Conversations){
    //Remove conversation if found
    const newConversations = ceramicConversations.filter(conversation => conversation !== _conversation);
    await ceramicStream.update({conversations: [...newConversations]});
    dispatch({ type: Actions.DELETE_CONVERSATION, payload: _conversation });
  }

  //Selects a new stream to load when conversation is clicked
  async function selectConversation(_conversation: Conversations){
    //Subscribe if conversations don't have empty/null streamIDs
    if(conversations.filter(conversation => conversation.streamID === "" || conversation.streamID === undefined).length === 0){
      await subscribeToConversations(conversations);
    }
    dispatch({ type: Actions.SELECT_CONVERSATION, payload: _conversation });
    //Check if user has browser notifications toggled on
    if(Notification.permission === "default"){
      Notification.requestPermission()
      .then((e) => {
        console.log(Notification.permission);
      })
    }
  }

  const inviteConversation = async (_conversation: Conversations) => {
    console.log(`Invite ${_conversation.address} to group`);
  }

  // Load messages on startup
  // useEffect(() => {
  //   async function loadMessages() {
  //     try {
  //       let timeoutID: NodeJS.Timeout;
  //       let messageArr: MessageData[];
  //       const stream = await streamr.getStream(getSelectedConversation().streamID);
  //       const storageNodes = await stream.getStorageNodes();
  //       //Load the last 50 messages from previous session if messages are being stored
  //       if(storageNodes.length !== 0){
  //         await streamr.resend(
  //             getSelectedConversation().streamID,
  //             {
  //               last: 50,
  //             },
  //             (message: MessageData) => {
  //               //Collect all data
  //               messageArr.push(message);
  //               //Reset timer if all data hasn't been gathered yet
  //               if(timeoutID)
  //               clearInterval(timeoutID);
  //               timeoutID = setTimeout(() => {
  //                 //Load messages after all data has been collected
  //                 dispatch({ type: Actions.SET_MESSAGES, payload: {conversation: getSelectedConversation(), messages: messageArr} })
  //               }, 100);
  //             }
  //           )
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   //Load if the user wallet is connected
  //   if(account && getSelectedConversation().messages.length === 0  && getSelectedConversation().streamID !== ""){
  //     loadMessages();
  //   }
  // }, [account, conversations.find(conversation => conversation.selected)])

  //Publish a message to stream
  const addMessage = async (_message: MessageData) => {
    try{
      streamr.publish(
        {streamId: getSelectedConversation().streamID, partition: 0},
        {
          sender: _message.sender,
          message: _message.message,
          date: _message.date
        }
      )
    }
    catch(err){
      alert("Please connect your wallet before using Hypha.");
      console.log(err);
    }
  };

  //Delete a message
  async function deleteMessage(_message: MessageData){
    console.log("Delete: " + _message.message)
  }

  function selectMessage(_message: MessageData){
    try {
      console.log(_message);
    } catch (e) {
      console.error(e)
    }
  }

  //Opens message context menu
  function openMessageContext(_message: MessageData){
    console.log("Open Message Context");
  }

  //Ceramic testing
  const testCeramic = async () => {

    //Create a new "conversations stream"
    const stream = await selfId.client.tileLoader.create(
      {
        conversations: {
          test1: 'test1 address',
          test2: 'test2 address',
          test3: 'test3 address',
        },
      },
      {
        tags: ['conversations'],
      },
      {
        pin: true,
      }
    );

    //Test Pinning
    const testPinning = async (streamId) => {
      await selfId.client.ceramic.pin.add(streamId);
      console.log(await selfId.client.ceramic.pin.ls());
    }

    const testUpdate = async (streamId) => {
      // const streamUpdate = await selfId.client.tileLoader.load('kjzl6cwe1jw146bdy7uhcesi6lnuj83sen0t7slvxnfcx6h5fz01p94nu2haccd');
      const streamUpdate = await selfId.client.tileLoader.load(streamId);
      await streamUpdate.update({conversations: {...streamUpdate.content.conversations, test4: 'test4 address'}});
      console.log(stream.content);
    }

    const testGet = async () => {
      const data = await selfId.client.get('basicProfile', `${account}@eip155:1`);
      console.log(data);
    }

    //General Info
    console.log(`Stream id: ${stream.id.toString()}`);
    console.log(`User DID: ${selfId.client.ceramic.did.id.toString()}`);
    console.log(stream.content);

    //Test Functions
    testPinning(stream.id);
    // testUpdate(stream.id);
    // testGet();
  }

  const testStreamr = async () => {
    try{
      // console.log(await getValidStream({ address: '0x98b01D04ab7B40Ffe856Be164f476a45Bf8E5B37', streamID: "", selected: false }));
      // console.log(streamr.getSubscriptions());
      // for await(const stream of streamr.searchStreams('0x92B188a4Db0E5a8475b3595f2A63188AF2AfAb16', { user: account, allowPublic: true })){
      //   console.log(stream.id);
      // }
      console.log(await getValidStream({address: '0x98b01D04ab7B40Ffe856Be164f476a45Bf8E5B37', selected: false, streamID: undefined}));
      // console.log(getSelectedConversation().profile?.name);
    }
    catch(e){
      console.error(e);
    }
  }

  return (
    <>
      {/* Top Bar */}
      <section id={styles.topBar}>
          <Link href="/">
            <a className="logoContainer">
              <HyphaLogo/>
            </a>
          </Link>
        <div>
          <p>{getSelectedConversation().profile?.name ? getSelectedConversation().profile?.name : getSelectedConversation().address !== "" ? getSelectedConversation().address : "Select A Conversation"}</p>
        </div>
        <div>
          <input
          type="text"
          placeholder="Search messages..."
          onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div>
          <button className="hypha-button" onClick={async () => testStreamr()}>Notifications</button>
        </div>
      </section>
      {/* Content Section */}
      <section id={styles.content}>
        <section id={styles.sidebarContainer}>
          <section id={styles.browserServers}>
            <ConversationModal
              show={conversationModal}
              addConversation={(address: string) => {
                setConversationModal(false);
                addConversations(address);
              }}
              cancel={() => setConversationModal(false)}
            />
            <button className="hypha-button" onClick={() => {setConversationModal(!conversationModal)}} disabled={selfId === undefined}>Add Conversations</button>
          </section>
          <section id={styles.conversationsList}>
            <div>
              <p>Conversations</p>
              {conversations.map((_conversation) => {
                return (
                  <Tooltip key={Math.random()} content={_conversation.address}>
                    <Conversation
                      key={Math.random()}
                      conversation={_conversation}
                      metadata={metadata}
                      inviteConversation={(_conversation: Conversations) => inviteConversation(_conversation)}
                      selectConversation={(_conversation: Conversations) => selectConversation(_conversation)}
                      deleteConversation={(_conversation: Conversations) => deleteConversation(_conversation)}
                    />
                  </Tooltip>
                );
              })}
              {/* <Group
                key={Math.random()}
                profile={"test profile"}
                selected={false}
                name={"test group"}
                streamID={"test stream"}
                clickGroup={() => console.log("Group Clicked")}
                deleteGroup={() => console.log("Delete Group")}
              /> */}
            </div>
          </section>
          <section id={styles.profile}>
            <Settings
              show={settingsModal}
              cancel={() => setSettingsModal(false)}
            />
            <button className={`hypha-button ${styles.settings}`} onClick={() => {setSettingsModal(!settingsModal)}}><Cog/></button>
            <Tooltip content={account}>
              <ConnectButton
                connect={connect}
                disconnect={disconnect}
              />
            </Tooltip>
          </section>
        </section>
        <section id={styles.messagesContainer}>
          <div>
            <div>
              {getSelectedConversation().messages?.filter(e => e.message.includes(searchKey)) && getSelectedConversation().messages?.filter(e => e.message.includes(searchKey)).map((message: MessageData) => {
                return (
                  <Message
                    key={Math.random()}
                    profile={message.sender === account ? profile : conversations.find(conversation => conversation.address === message.sender).profile}
                    payload={message}
                    userAddress={account}
                    selectMessage={(message: MessageData) => selectMessage(message)}
                    deleteMessage={(message: MessageData) => deleteMessage(message)}
                    openMessageContext={(message: MessageData) => openMessageContext(message)}
                  />
                );
              })}
            </div>
          </div>
          <SendMessage
            disable={!getSelectedConversation().selected}
            typing={(typing: boolean) => setMetadata(oldMetadata => ({...oldMetadata, typing: typing}))}
            sendMessage={(messageText: string) => addMessage({sender: account, message: messageText, date: new Date().toString()})}
          />
        </section>
      </section>
    </>
  );
}

export const getServerSideProps: GetStaticProps = async () => { 
  return { props: {} }
}

export default App;
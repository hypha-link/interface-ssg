declare global {
  interface Window {
    ethereum: ExternalProvider
  }
}

import { ExternalProvider } from "ethers/node_modules/@ethersproject/providers";
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
import getOrCreateMessageStream, { ConversationType } from "../services/Streamr_API"
import { Conversations, MessagePayload } from "../components/utils/Types";
import { GetStaticProps } from "next";
import useMetadata from "../components/hooks/useMetadata";
import { Stream, StreamPermission } from "streamr-client";
import useConversationStorage, { localStreamKey } from "../components/hooks/useConversationStorage"

import { DispatchContext, StateContext } from "../components/context/AppState";
import { Actions } from "../components/context/AppContextTypes";
import getHyphaProfile from "../get/getHyphaProfile";
import getProfileImage from "../get/getProfileImage";
import { ethers } from "ethers";
import useStreamrSession from '../components/hooks/useStreamrSession';
import { InviteModal } from "../components/InviteModal";

function App({ data }) {
  const { activateBrowserWallet } = useEthers();

  //Global State
  const { selfId, notifications, conversations, selectedConversation, streamr, streamrDelegate, ownProfile, web3Provider } = useContext(StateContext);
  const { address: ownAddress } = ownProfile || {};
  const dispatch = useContext(DispatchContext);

  //Component Constructors
  const [conversationModal, setConversationModal] = useState(false);
  const [invitedConversation, setInvitedConversation] = useState<Conversations>(undefined);
  const [settingsModal, setSettingsModal] = useState(false);
  const [searchKey, setSearchKey] = useState<string>('');

  const [metadata, setMetadata] = useMetadata(selectedConversation);
  const { ceramicConversations, ceramicStream } = useConversationStorage();

  console.log(conversations);

  useStreamrSession();

  useEffect(() => {
    const connect = async () => {
      try{
        const selfIdClient = await SelfID.authenticate({
          authProvider: new EthereumAuthProvider(window.ethereum, ownAddress),
          ceramic: 'testnet-clay',
          connectNetwork: 'testnet-clay',
        })
        dispatch({ type: Actions.SET_SELFID, payload: selfIdClient });
        dispatch({ type: Actions.SET_PROFILE, payload: {address: ownAddress, ...await selfIdClient.get('basicProfile')} });
      }
      catch{
        console.log("User needs an Ethereum wallet to connect to Hypha.");
      }
    }
    if(ownAddress){
      connect();
      // if(web3Provider) web3Provider.getSigner().signMessage('Welcome to Hypha');
    }
  }, [ownAddress])

  //Connects ethereum wallet to Hypha
  const connect = async () => {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      activateBrowserWallet();
      dispatch({ type: Actions.SET_WEB3_PROVIDER, payload: provider });
      dispatch({ type: Actions.SET_ACCOUNT, payload: await signer.getAddress() });
      console.log("The client attempted to connect");
    }
    catch(e){
      alert('Please enable your wallet to connect to Hypha.');
      console.error(`Could not connect to wallet: ` + e);
    }
  };

  //Disconnects wallet and removes all data from window
  const disconnect = async () => {
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
      //Add conversation profiles to object
      const newConversations = await Promise.all(ceramicConversations.map(async (conversation) => {
        const newProfile = await Promise.all(conversation.profile.map(async (profile) => {
          try{
            profile = {address: profile.address, ...await selfId.client.get('basicProfile', `${profile.address}@eip155:${web3Provider.network.chainId}`)}
          }
          catch(e){
            console.warn(`There is no DID that exists for ${profile.address}`);
          }
          return profile;
        }))
        const newConversation = {...conversation, profile: newProfile};
        return newConversation;
      }));
      //Set valid streams if any conversations don't have one
      if(newConversations.some(conversation => conversation.streamId === '' || conversation.streamId === undefined)) await setAllValidStreams(newConversations);
      //Subscribe if conversations don't have empty/null streamIds
      if(newConversations.filter(conversation => conversation.streamId === '' || conversation.streamId === undefined).length === 0) await subscribeToConversations(newConversations);
      dispatch({ type: Actions.SET_CONVERSATIONS, payload: newConversations });
    }
    if(selfId && ceramicConversations?.length > 0 && streamr){
      loadConversations();
      setMetadata(oldMetadata => ({...oldMetadata, online: true}));
    }
  }, [selfId, ceramicConversations, streamr])

  const subscribeToConversations = async (_conversations: Conversations[]) => {
    const subs = await streamr.getSubscriptions();
    //Subscribe to stream after messages were resent
    await Promise.all(_conversations.map(async (conversation) => {
      //Check if conversation streamId is empty & check if we are already subscribed
      if(conversation.streamId !== "" && subs.length === 0){
        await streamr.subscribe(
          {
            stream: conversation.streamId,
            partition: 0,
          }, (data: MessagePayload) => {
            //Create a new notification if the new message was not sent by us & interface is not visible
            if(data.sender !== ownAddress && document.visibilityState !== "visible"){
              //Get the profile of the user that sent the message
              const senderProfile = conversation.profile.find(_profile => _profile.address === data.sender);
              const name = senderProfile?.name ? senderProfile?.name : data.sender;
              const image = getProfileImage(senderProfile);
              const notification = new Notification(`${name} sent you a message!`, {body: data.message, icon: image});
              dispatch({ type: Actions.ADD_NOTIFICATION, payload: notification });
            }
            const newConversations = _conversations.map((_conversation) => {
              if(conversation.streamId === _conversation.streamId){
                if(_conversation.messages){
                  _conversation.messages = [..._conversation.messages, data];
                }
                else{
                  _conversation.messages = [data];
                }
              }
              return _conversation;
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
      for await(const stream of streamr.searchStreams(getHyphaProfile(_conversation).address, { user: ownAddress, allowPublic: true })){
        streams.push(stream);
      }
      for await(const stream of streamr.searchStreams(ownAddress, { user: getHyphaProfile(_conversation).address, allowPublic: true })){
        streams.push(stream);
      }
      //Return found stream
      if(streams.length !== 0) return streams[0];
      //Create a new stream since none were found
      const newStream = await getOrCreateMessageStream(streamr, getHyphaProfile(_conversation).address, ConversationType.Hypha, false);
      return newStream;
    }
    catch(e){
      console.warn(e);
    }
  }

  const setValidStream = async (_conversation: Conversations) => {
    const validStream = await getValidStream(_conversation);
    const newConversations: Conversations[] = ceramicConversations.map((conversation) => {
      if(getHyphaProfile(_conversation).address === getHyphaProfile(conversation).address){
        conversation.streamId = validStream.id;
      }
      return conversation;
    });
    dispatch({ type: Actions.SET_CONVERSATIONS, payload: newConversations });
    await ceramicStream.update({conversations: [...newConversations]});
  }

  const setAllValidStreams = async (_conversations: Conversations[]) => {
    //Check if any of the conversations have empty or undefined streamIds
    if(_conversations.filter(conversation => conversation.streamId === "" || conversation.streamId === undefined).length > 0){
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
    if(!ceramicConversations?.some(conversation => getHyphaProfile(conversation).address === _address)){
      const validStream = await getValidStream({ profile: [{ address: _address }], streamId: undefined, selected: false, type: ConversationType.Hypha });
      console.log(validStream);
      const newConversation: Conversations = {
        profile: [{ address: _address }],
        streamId: validStream.id,
        selected: false,
        type: ConversationType.Hypha,
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
        window.localStorage.setItem(`${ownAddress}-${localStreamKey}`, stream.id.toString());
      }
      dispatch({ type: Actions.ADD_CONVERSATION, payload: newConversation });
    }
  }

  async function deleteConversation(_conversation: Conversations){
    //Remove conversation if found
    const newConversations = ceramicConversations.filter(conversation => conversation.streamId !== _conversation.streamId);
    await ceramicStream.update({conversations: [...newConversations]});
    dispatch({ type: Actions.DELETE_CONVERSATION, payload: _conversation });
  }

  //Selects a new stream to load when conversation is clicked
  async function selectConversation(_conversation: Conversations){
    //Subscribe if conversations don't have empty/null streamIds
    if(conversations.filter(conversation => conversation.streamId === "" || conversation.streamId === undefined).length === 0){
      await subscribeToConversations(conversations);
      dispatch({ type: Actions.SELECT_CONVERSATION, payload: _conversation });
      //Check if user has browser notifications toggled on
      if(Notification.permission === "default"){
        Notification.requestPermission()
        .then((e) => {
          console.log(Notification.permission);
        })
      }
    }
  }

  const inviteConversation = async (_conversation: Conversations) => {
    console.log(`Invite ${getHyphaProfile(_conversation).address}`);
    setInvitedConversation(_conversation);
  }

  // Load messages on startup
  // useEffect(() => {
  //   async function loadMessages() {
  //     try {
  //       let timeoutID: NodeJS.Timeout;
  //       let messageArr: MessagePayload[];
  //       const stream = await streamr.getStream(selectedConversation.streamId);
  //       const storageNodes = await stream.getStorageNodes();
  //       //Load the last 50 messages from previous session if messages are being stored
  //       if(storageNodes.length !== 0){
  //         await streamr.resend(
  //             selectedConversation.streamId,
  //             {
  //               last: 50,
  //             },
  //             (message: MessagePayload) => {
  //               //Collect all data
  //               messageArr.push(message);
  //               //Reset timer if all data hasn't been gathered yet
  //               if(timeoutID)
  //               clearInterval(timeoutID);
  //               timeoutID = setTimeout(() => {
  //                 //Load messages after all data has been collected
  //                 dispatch({ type: Actions.SET_MESSAGES, payload: {conversation: selectedConversation, messages: messageArr} })
  //               }, 100);
  //             }
  //           )
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   //Load if the user wallet is connected
  //   if(account && selectedConversation.messages.length === 0  && selectedConversation.streamId !== ""){
  //     loadMessages();
  //   }
  // }, [account, conversations.find(conversation => conversation.selected)])

  //Publish a message to stream
  const addMessage = async (_message: MessagePayload) => {
    try{
      //Grant publish permissions to the delegate if it doesn't have them already
      if(!await streamr.isStreamPublisher(selectedConversation.streamId, streamrDelegate?.wallet.address)){
        await streamr.grantPermissions(selectedConversation.streamId, {
          user: streamrDelegate?.wallet.address,
          permissions: [StreamPermission.PUBLISH],
        })
      }
      await streamrDelegate?.client.publish(
        {streamId: selectedConversation.streamId, partition: 0},
        {
          sender: _message.sender,
          message: _message.message,
          date: _message.date
        }
      )
    }
    catch(e){
      alert('Please fund the connected wallet with Matic tokens to use Hypha');
    }
  };

  //Delete a message
  async function deleteMessage(_message: MessagePayload){
    console.log("Delete: " + _message.message)
  }

  function selectMessage(_message: MessagePayload){
    try {
      console.log(_message);
    } catch (e) {
      console.error(e)
    }
  }

  const testStreamr = async () => {
    try{
      dispatch({type: Actions.ADD_CONVERSATION, payload: { profile: [{ address: 'hyphae' }], selected: false, streamId: 'Johns Hyphae', type: ConversationType.Hyphae }});
      dispatch({type: Actions.ADD_CONVERSATION, payload: { profile: [{ address: 'mycelium' }], selected: false, streamId: 'Johns Mycelium', type: ConversationType.Mycelium }});
      // console.log(await streamr.getStream('0x98b01d04ab7b40ffe856be164f476a45bf8e5b37/hypha/0x92B188a4Db0E5a8475b3595f2A63188AF2AfAb16'));
      // console.log(await streamr.getStream(selectedConversation.streamId));
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
          <p>{selectedConversation.streamId !== '' ? selectedConversation.type === ConversationType.Hypha ? getHyphaProfile(selectedConversation)?.name : selectedConversation.streamId : 'Select A Conversation'}</p>
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
            <button className="hypha-button" onClick={() => {setConversationModal(!conversationModal)}} disabled={!selfId}>Add Conversations</button>
          </section>
          <section id={styles.conversationsList}>
            <div>
              <p>Conversations</p>
              {conversations.map((_conversation) => {
                return (
                    <Conversation
                      key={Math.random()}
                      conversation={_conversation}
                      metadata={metadata}
                      inviteConversation={(_conversation: Conversations) => inviteConversation(_conversation)}
                      selectConversation={(_conversation: Conversations) => selectConversation(_conversation)}
                      deleteConversation={(_conversation: Conversations) => deleteConversation(_conversation)}
                    />
                );
              })}
            </div>
            <InviteModal 
              invitedConversation={invitedConversation}
              cancel={() => setInvitedConversation(undefined)}
            />
          </section>
          <section id={styles.profile}>
            <Settings
              show={settingsModal}
              cancel={() => setSettingsModal(false)}
            />
            <button className={`hypha-button ${styles.settings}`} onClick={() => {setSettingsModal(!settingsModal)}}><Cog/></button>
            <Tooltip content={ownAddress}>
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
              {selectedConversation.messages?.filter(e => e.message.includes(searchKey)) && selectedConversation.messages?.filter(e => e.message.includes(searchKey)).map((message: MessagePayload) => {
                return (
                  <Message
                    key={Math.random()}
                    payload={message}
                    selectMessage={(message: MessagePayload) => selectMessage(message)}
                    deleteMessage={(message: MessagePayload) => deleteMessage(message)}
                  />
                );
              })}
            </div>
          </div>
          <SendMessage
            disable={!selectedConversation.selected}
            typing={(typing: boolean) => setMetadata(oldMetadata => ({...oldMetadata, typing: typing}))}
            sendMessage={(messageText: string) => addMessage({sender: ownAddress, message: messageText, date: new Date().toString()})}
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
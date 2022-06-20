declare global {
  interface Window {
    ethereum: ExternalProvider
  }
}

import { ExternalProvider } from "@ethersproject/providers";
import React, { useContext, useEffect, useState } from "react";
import styles from '../styles/app.module.css'
import Link from "next/link";
import HyphaLogo from "../public/logo/hypha-01.svg"
import Cog from "../public/fa/cog.svg"

import { useEthers } from "@usedapp/core";
import { create } from "ipfs-core";

import { ConnectButton } from "../components/ConnectButton";
import { Message } from "../components/Message";
import { Conversation } from "../components/Conversation";
import { SendMessage } from "../components/SendMessage";
import { ConversationModal } from "../components/ConversationModal";
import { Settings } from "../components/Settings";
import { Tooltip } from "../components/utils/Tooltip";

import { EthereumAuthProvider, SelfID } from '@self.id/web';
import getOrCreateMessageStream, { ConversationType } from "../services/Streamr_API"
import { Conversations, MessagePayload, Metadata } from "../components/utils/Types";
import { GetStaticProps } from "next";
import usePublishMetadata from "../components/hooks/usePublishMetadata";
import { Stream, StreamPermission } from "streamr-client";
import useConversationStorage, { localStreamKey } from "../components/hooks/useConversationStorage"

import { DispatchContext, StateContext } from "../components/context/AppState";
import { Actions } from "../components/context/AppContextTypes";
import getConversationProfile from "../get/getConversationProfile";
import getProfilePicture from "../get/getProfilePicture";
import { ethers } from "ethers";
import useStreamrSession from '../components/hooks/useStreamrSession';
import { InviteModal } from "../components/InviteModal";
import { MyceliumCreationModal } from "../components/MyceliumCreationModal";
import useSelectedConversation from "../components/hooks/useSelectedConversation";
import Head from "next/head";
import Occlusion, { OcclusionContext } from "../components/utils/Occlusion";

function App({ data }) {
  const { activateBrowserWallet } = useEthers();

  //Global State
  const { selfId, notifications, conversations, streamr, streamrDelegate, ownProfile, web3Provider } = useContext(StateContext);
  const { address: ownAddress } = ownProfile || {};
  const dispatch = useContext(DispatchContext);
  const occludedElements = useContext(OcclusionContext);

  //Component Constructors
  const [conversationModal, setConversationModal] = useState<string>(undefined);
  const [invitedConversation, setInvitedConversation] = useState<Conversations>(undefined);
  const [showMyceliumCreationModal, setShowMyceliumCreationModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [searchKey, setSearchKey] = useState<string>('');

  const selectedConversation = useSelectedConversation();
  const [setMetadata] = usePublishMetadata(selectedConversation);
  const { ceramicConversations, ceramicStream } = useConversationStorage();

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
        dispatch({ type: Actions.SET_IPFS, payload: await create({ repo: "uploaded-files"})});
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
      console.info("The client attempted to connect");
    }
    catch(e){
      alert('Please enable your wallet to connect to Hypha.');
      console.error(`Could not connect to wallet: ` + e);
    }
  };

  //Disconnects wallet and removes all data from window
  const disconnect = async () => {
    console.info("The client has been disconnected");
    notifications.forEach(notification => {
      notification.close();
    });
    setSearchKey('');
    setMetadata(undefined);
    dispatch({ type: Actions.CLEAR_STATE })
  };

  useEffect(() => {
    async function loadConversations(){
      //Add conversation profiles & initial metadata to object
      const newConversations = await Promise.all(ceramicConversations.map(async (conversation) => {
        const newProfile = await Promise.all(conversation.profile.map(async (profile) => {
          try{
            //Retrieve the DID address associated with this ethereum address
            const didAddress = await selfId.client.getAccountDID(`${profile.address}@eip155:${web3Provider.network.chainId}`);
            //Return the basicProfile associated with this DID address
            return {address: profile.address, ...await selfId.client.get('basicProfile', didAddress)}
          }
          catch(e){
            console.warn(`There is no DID that exists for ${profile.address}`);
            console.log(e);
          }
        }))
        //Returns the conversation with a profile & initial metadata
        return {...conversation, profile: newProfile, metadata: {address: '', typing: false, online: false, receipt: false, invite: ''}};
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
      console.log(subs);
      //Check if conversation streamId is empty & check if we are already subscribed
      if(conversation.streamId !== "" && subs.filter(sub => sub.streamPartId.substring(0, sub.streamPartId.indexOf('#')) === conversation.streamId).length === 0){
        console.info('Subscribed to ' + conversation.streamId);
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
              const image = getProfilePicture(senderProfile).image;
              const notification = new Notification(`${name} sent you a message!`, {body: data.message, icon: image});
              dispatch({ type: Actions.ADD_NOTIFICATION, payload: notification });
            }
            dispatch({ type: Actions.ADD_MESSAGE, payload: {conversation: conversation, message: data}});
          }
        )
        await streamr.subscribe(
          {
            stream: conversation.streamId,
            partition: 1,
          }, (data: Metadata) => {
            if(data.address !== ownProfile.address){
              dispatch({ type: Actions.SET_METADATA, payload: {conversation: conversation, metadata: data}});
              console.log(data.invite);
              if(data?.invite){
                setConversationModal(data.invite);
              }
            }
          }
        )
      }
    }))
  }
  
  const getValidStream = async (_conversation: Conversations) => {
    if(_conversation.type !== ConversationType.Hypha) return;

    try{
      const streams: Stream[] = [];
      //Check if either conversation has a stream
      for await(const stream of streamr.searchStreams(getConversationProfile(_conversation).address, { user: ownAddress, allowPublic: true })){
        streams.push(stream);
      }
      for await(const stream of streamr.searchStreams(ownAddress, { user: getConversationProfile(_conversation).address, allowPublic: true })){
        streams.push(stream);
      }
      //Return found stream
      if(streams.length !== 0) return streams[0];
      //Create a new stream since none were found
      const newStream = await getOrCreateMessageStream(streamr, getConversationProfile(_conversation).address, ConversationType.Hypha, false);
      return newStream;
    }
    catch(e){
      console.warn(e);
    }
  }

  const setValidStream = async (_conversation: Conversations) => {
    if(_conversation.type !== ConversationType.Hypha) return;

    const validStream = await getValidStream(_conversation);
    const newConversations: Conversations[] = ceramicConversations.map((conversation) => {
      if(getConversationProfile(_conversation).address === getConversationProfile(conversation).address){
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
    if(!ceramicConversations?.some(conversation => getConversationProfile(conversation).address === _address)){
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
    dispatch({ type: Actions.SELECT_CONVERSATION, payload: _conversation });
    //Subscribe if conversations don't have empty/null streamIds
    if(conversations.filter(conversation => conversation.streamId === "" || conversation.streamId === undefined).length === 0){
      await subscribeToConversations(conversations);
      //Check if user has browser notifications toggled on
      if(Notification.permission === "default"){
        Notification.requestPermission()
        .then((e) => {
          console.log(Notification.permission);
        })
      }
    }
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
      console.error(e);
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

  async function createHyphae(){
    const id = Math.floor(Math.random()*16777215).toString(16);
    console.log('Create Hyphae ' + id);

    //Check if conversation exists already
    if(!ceramicConversations?.some(conversation => conversation.streamId.includes(id))){
      const stream = await getOrCreateMessageStream(streamr, id, ConversationType.Hyphae, false);
      const newConversation: Conversations = {
        profile: [{ address: id }],
        streamId: stream.id,
        selected: false,
        type: ConversationType.Hyphae,
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
      dispatch({type: Actions.ADD_CONVERSATION, payload: newConversation});
    }
  }

  async function createMycelium(name: string){
    console.log('Create Mycelium ' + name);

    //Check if conversation exists already
    if(!ceramicConversations?.some(conversation => conversation.streamId.includes(name))){
      const stream = await getOrCreateMessageStream(streamr, name, ConversationType.Mycelium, false);
      const newConversation: Conversations = {
        profile: [{ address: name }],
        streamId: stream.id,
        selected: false,
        type: ConversationType.Mycelium,
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
      dispatch({type: Actions.ADD_CONVERSATION, payload: newConversation});
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
      <Head>
        <title>App | Hypha</title>
      </Head>
      {/* Occluded Elements */}
      {
        occludedElements ?
        <Occlusion>
          {occludedElements}
        </Occlusion>
        :
        <></>
      }
      {/* Top Bar */}
      <section id={styles.topBar}>
          <Link href="/">
            <a className="logoContainer">
              <HyphaLogo/>
            </a>
          </Link>
        <div>
          <p>{selectedConversation.streamId !== '' ? selectedConversation.type === ConversationType.Hypha ? getConversationProfile(selectedConversation)?.name : selectedConversation.streamId : 'Select A Conversation'}</p>
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
                setConversationModal(undefined);
                addConversations(address);
              }}
              cancel={() => setConversationModal(undefined)}
            />
            <button 
              className="hypha-button" 
              onClick={() => {setConversationModal('')}} 
              disabled={!selfId}
            >Add Conversations</button>
          </section>
          <section id={styles.conversationsList}>
            <div>
              <p>Conversations</p>
              {conversations.map((_conversation) => {
                return (
                    <Conversation
                      key={Math.random()}
                      conversation={_conversation}
                      inviteConversation={(_conversation: Conversations) => setInvitedConversation(_conversation)}
                      selectConversation={(_conversation: Conversations) => selectConversation(_conversation)}
                      deleteConversation={(_conversation: Conversations) => deleteConversation(_conversation)}
                    />
                );
              })}
            </div>
            <InviteModal 
              invitedConversation={invitedConversation}
              createHyphae={async () => await createHyphae()}
              openMyceliumModal={() => {setShowMyceliumCreationModal(true)}}
              cancel={() => setInvitedConversation(undefined)}
            />
            <MyceliumCreationModal
              show={showMyceliumCreationModal}
              create={async (name: string) => await createMycelium(name)}
              cancel={() => setShowMyceliumCreationModal(false)}
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

export default App;
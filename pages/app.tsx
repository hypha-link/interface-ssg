import React, { useContext, useEffect, useState } from "react";
import styles from '../styles/app.module.css'
import Link from "next/link";
import HyphaLogo from "../public/logo/hypha-01.svg"
import Cog from "../public/fa/cog.svg"

import { useEthers } from "@usedapp/core";

import { ConnectButton } from "../components/ConnectButton";
import { Message } from "../components/Message";
import { Friend } from "../components/Friend";
import { SendMessage } from "../components/SendMessage";
import { FriendModal } from "../components/FriendModal";
import { Settings } from "../components/Settings";
import { Tooltip } from "../components/utilities/Tooltip";

import { EthereumAuthProvider, SelfID } from '@self.id/web';
import getOrCreateMessageStream, { streamr, HyphaType } from "../services/Streamr_API"
import { Friends, MessageData } from "../components/utilities/Types";
import { GetStaticProps } from "next";
import useMetadata from "../hooks/useMetadata";
import { Stream } from "streamr-client";
import useFriendStorage, { localStreamKey } from "../hooks/useFriendStorage"

import { DispatchContext, StateContext } from "../components/context/AppState";
import { Actions } from "../components/context/AppContextTypes";

function App({ data }) {
  const { account, activateBrowserWallet, deactivate, chainId } = useEthers();

  //Global State
  const { selfId, profile, notifications, friends } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  //Component Constructors
  const [friendModal, setFriendModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [searchKey, setSearchKey] = useState<string>('');

  const getSelectedFriend = () => {
    return friends.find((friend) => friend.selected)
    ? friends.find((friend) => friend.selected)
    : { address: "", streamID: "", selected: false };
  }

  const [metadata, setMetadata] = useMetadata(getSelectedFriend());
  const { ceramicFriends, ceramicStream } = useFriendStorage();

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
    async function loadFriends(){
      //Add friend user profiles to object
      const newFriends = await Promise.all(ceramicFriends.map(async (friend) => {
        try{
          friend.profile = await selfId.client.get('basicProfile', `${friend.address}@eip155:${chainId}`);
        }
        catch(e){
          console.warn(`There is no DID that exists for ${friend.address}`);
        }
        return friend;
      }));
      //Set valid streams if any friends don't have one
      if(newFriends.some(friend => friend.streamID === '' || friend.streamID === undefined)) await setAllValidStreams(newFriends);
      //Subscribe if friends don't have empty/null streamIDs
      if(newFriends.filter(friend => friend.streamID === '' || friend.streamID === undefined).length === 0) await subscribeToConversations(newFriends);
      dispatch({ type: Actions.SET_FRIENDS, payload: newFriends });
    }
    if(selfId && ceramicFriends?.length > 0){
      loadFriends();
      setMetadata(oldMetadata => ({...oldMetadata, online: true}));
    }
  }, [selfId, ceramicFriends])

  const subscribeToConversations = async (_friends: Friends[]) => {
    const subs = await streamr.getSubscriptions();
    //Subscribe to stream after messages were resent
    await Promise.all(_friends.map(async (friend) => {
      //Check if friend streamID is empty & check if we are already subscribed
      if(friend.streamID !== "" && subs.length === 0){
        await streamr.subscribe(
          {
            stream: friend.streamID,
            partition: 0,
          }, (data: MessageData) => {
            //Create a new notification if the new message was not sent by us & interface is not visible
            if(data.sender !== account && document.visibilityState !== "visible"){
              const name = getSelectedFriend().profile?.name ? getSelectedFriend().profile?.name : data.sender;
              const image = getSelectedFriend().profile?.image?.alternatives[0].src ? `https://ipfs.io/ipfs/${getSelectedFriend().profile.image.alternatives[0].src?.substring(7, getSelectedFriend().profile.image.alternatives[0].src?.length)}` : `https://robohash.org/${data.sender}.png?set=set5`;
              const notification = new Notification(`${name} sent you a message!`, {body: data.message, icon: image});
              dispatch({ type: Actions.ADD_NOTIFICATION, payload: notification });
            }
            const newFriends = _friends.map((e) => {
              if(friend.address === e.address){
                if(e.messages){
                  e.messages = [...e.messages, data];
                }
                else{
                  e.messages = [data];
                }
              }
              return e;
            })
            dispatch({ type: Actions.SET_FRIENDS, payload: newFriends });
          }
        )
      }
    }))
  }
  
  const getValidStream = async (_friend: Friends) => {
    try{
      const streams: Stream[] = [];
      //Check if either friend has a stream
      for await(const stream of streamr.searchStreams(_friend.address, { user: account, allowPublic: true })){
        streams.push(stream);
      }
      for await(const stream of streamr.searchStreams(account, { user: _friend.address, allowPublic: true })){
        streams.push(stream);
      }
      //Return found stream
      if(streams.length !== 0) return streams[0];
      //Create a new stream since none were found
      const newStream = await getOrCreateMessageStream(_friend.address, HyphaType.Hypha, false);
      return newStream;
    }
    catch(e){
      console.warn(e);
    }
  }

  const setValidStream = async (_friend: Friends) => {
    const validStream = await getValidStream(_friend);
    const newFriends: Friends[] = ceramicFriends.map((e) => {
      if(_friend.address === e.address){
        e.streamID = validStream.id;
      }
      return e;
    });
    dispatch({ type: Actions.SET_FRIENDS, payload: newFriends });
    await ceramicStream.update({friends: [...newFriends]});
  }

  const setAllValidStreams = async (_friends: Friends[]) => {
    //Check if any of the friends have empty or undefined streamIDs
    if(_friends.filter(friend => friend.streamID === "" || friend.streamID === undefined).length > 0){
      Promise.all(_friends.map(friend => {
        return new Promise<void>((resolve) => {
          setValidStream(friend);
          resolve();
        });
      }));
    }
  }

  async function addFriends(_address: string){
    //Check if friend exists already
    if(!ceramicFriends?.some(friend => friend.address === _address)){
      const validStream = await getValidStream({ address: _address, selected: false, streamID: undefined });
      console.log(validStream);
      const newFriend = {
        address: _address,
        streamID: validStream.id,
        selected: false,
      }
      //Create a new friends stream if there are no previously existing streams & pin it
      if(ceramicFriends){
        await ceramicStream.update({friends: [...ceramicFriends, newFriend]})
      }
      else{
        const stream = await selfId.client.tileLoader.create(
          {
            friends: [newFriend]
          },
          {
            tags: ['friends'],
          },
          {
            pin: true,
          }
        );
        //Add a new local storage record of the stream ID
        window.localStorage.setItem(`${account}-${localStreamKey}`, stream.id.toString());
      }
      dispatch({ type: Actions.ADD_FRIEND, payload: newFriend });
    }
  }

  async function deleteFriend(_friend: Friends){
    //Remove friend if found
    const newFriends = ceramicFriends.filter(friend => friend !== _friend);
    await ceramicStream.update({friends: [...newFriends]});
    dispatch({ type: Actions.DELETE_FRIEND, payload: _friend });
  }

  //Selects a new stream to load when friend is clicked
  async function selectFriend(_friend: Friends){
    //Subscribe if friends don't have empty/null streamIDs
    if(friends.filter(friend => friend.streamID === "" || friend.streamID === undefined).length === 0){
      await subscribeToConversations(friends);
    }
    dispatch({ type: Actions.SELECT_FRIEND, payload: _friend });
    //Check if user has browser notifications toggled on
    if(Notification.permission === "default"){
      Notification.requestPermission()
      .then((e) => {
        console.log(Notification.permission);
      })
    }
  }

  const inviteFriend = async (_friend: Friends) => {
    console.log(`Invite ${_friend.address} to group`);
  }

  // Load messages on startup
  // useEffect(() => {
  //   async function loadMessages() {
  //     try {
  //       let timeoutID: NodeJS.Timeout;
  //       let messageArr: MessageData[];
  //       const stream = await streamr.getStream(getSelectedFriend().streamID);
  //       const storageNodes = await stream.getStorageNodes();
  //       //Load the last 50 messages from previous session if messages are being stored
  //       if(storageNodes.length !== 0){
  //         await streamr.resend(
  //             getSelectedFriend().streamID,
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
  //                 dispatch({ type: Actions.SET_MESSAGES, payload: {friend: getSelectedFriend(), messages: messageArr} })
  //               }, 100);
  //             }
  //           )
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   //Load if the user wallet is connected
  //   if(account && getSelectedFriend().messages.length === 0  && getSelectedFriend().streamID !== ""){
  //     loadMessages();
  //   }
  // }, [account, friends.find(friend => friend.selected)])

  //Publish a message to stream
  const addMessage = async (_message: MessageData) => {
    try{
      streamr.publish(
        {streamId: getSelectedFriend().streamID, partition: 0},
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

    //Create a new "friends stream"
    const stream = await selfId.client.tileLoader.create(
      {
        friends: {
          test1: 'test1 address',
          test2: 'test2 address',
          test3: 'test3 address',
        },
      },
      {
        tags: ['friends'],
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
      await streamUpdate.update({friends: {...streamUpdate.content.friends, test4: 'test4 address'}});
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
      // console.log(getSelectedFriend().profile?.name);
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
          <p>{getSelectedFriend().profile?.name ? getSelectedFriend().profile?.name : getSelectedFriend().address !== "" ? getSelectedFriend().address : "Select A Friend"}</p>
        </div>
        <div>
          <input
          type="text"
          placeholder="Search..."
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
            <FriendModal
              show={friendModal}
              addFriend={(address: string) => {
                setFriendModal(false);
                addFriends(address);
              }}
              cancel={() => setFriendModal(false)}
            />
            <button className="hypha-button" onClick={() => {setFriendModal(!friendModal)}} disabled={selfId === undefined}>Add Friends</button>
          </section>
          <section id={styles.friendsList}>
            <div>
              <p>Conversations</p>
              {friends.map((_friend) => {
                return (
                  <Tooltip key={Math.random()} content={_friend.address}>
                    <Friend
                      key={Math.random()}
                      friend={_friend}
                      metadata={metadata}
                      inviteFriend={(_friend: Friends) => inviteFriend(_friend)}
                      selectFriend={(_friend: Friends) => selectFriend(_friend)}
                      deleteFriend={(_friend: Friends) => deleteFriend(_friend)}
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
              {getSelectedFriend().messages?.filter(e => e.message.includes(searchKey)) && getSelectedFriend().messages?.filter(e => e.message.includes(searchKey)).map((message: MessageData) => {
                return (
                  <Message
                    key={Math.random()}
                    profile={message.sender === account ? profile : friends.find(friend => friend.address === message.sender).profile}
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
            disable={!getSelectedFriend().selected}
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
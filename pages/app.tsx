import React, { useEffect, useState, useReducer } from "react";
import styles from '../styles/app.module.css'
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import HyphaLogo from "../public/hypha-01.svg"

import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

import { ConnectButton } from "../components/ConnectButton";
import { Message } from "../components/Message";
import { Friend } from "../components/Friend";
import { SendMessage } from "../components/SendMessage";
import { FriendModal } from "../components/FriendModal";
import { Settings } from "../components/Settings";
import { Group } from "../components/Group";
import { Tooltip } from "../components/utilities/Tooltip";

import { EthereumAuthProvider, SelfID } from '@self.id/web';
import getOrCreateMessageStream, { streamr, grantPermissions, PermissionType, HyphaType, streamrUnsigned } from "../services/Streamr_API"
import { BasicProfile } from "@datamodels/identity-profile-basic";
import { Friends, MessageData, Metadata } from "../components/utilities/Types";
import { Stream } from "streamr-client";
import { GetStaticProps } from "next";
import useMetadata from "../hooks/useMetadata";

function App({ data }) {
  const { account, activateBrowserWallet, deactivate, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);

  const [selfId, setSelfId] = useState<SelfID>();
  const [profile, setProfile] = useState<BasicProfile>();

  //Component Constructors
  const [friends, setFriends] = useState<Friends[]>([])
  const [friendModal, setFriendModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchKey, setSearchKey] = useState<string>('');

  const localStreamKey = "friends-streamId";

  useEffect(() => {
    const connect = async () => {
      if(account){
        try{
          await streamr.connect()
          await streamrUnsigned.connect();
          const selfIdClient = await SelfID.authenticate({
            //@ts-ignore
            authProvider: new EthereumAuthProvider(window.ethereum, account),
            ceramic: 'testnet-clay',
            connectNetwork: 'testnet-clay',
          })
          setSelfId(selfIdClient);
          setProfile(await selfIdClient.get('basicProfile'));
        }
        catch{
          console.log("User needs an Ethereum wallet to connect to Hypha.");
        }
      }
    }
    connect();
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
    setFriends([]);
    notifications.forEach(notification => {
      notification.close();
    });
    setSearchKey('');
    setMetadata(undefined);
    setProfile(undefined);
    setSelfId(undefined);
    if(streamr){
      streamr.getSubscriptions().forEach(async (sub) => await sub.unsubscribe());
      await streamr.disconnect()
    }
    if(streamrUnsigned){
      streamrUnsigned.getSubscriptions().forEach(async (sub) => await sub.unsubscribe());
      await streamrUnsigned.disconnect()
    }
  };

  useEffect(() => {
    async function loadFriends(){
      //Check local storage for stream key
        const stream = await selfId.client.tileLoader.load(window.localStorage.getItem(localStreamKey));
        const streamFriends:Friends[] = stream.content.friends;

        if(streamFriends.length > 0){
          //Add friend user profiles to object
          const newFriends = await Promise.all(streamFriends.map(async (friend) => {
            try{
              friend.profile = await selfId.client.get('basicProfile', `${friend.address}@eip155:${chainId}`);
            }
            catch(e){
              console.log(`There is no DID that exists for ${friend.address}`);
            }
            return friend;
          }));
          setFriends(newFriends);
        }
      }
    if(window.localStorage.getItem(localStreamKey) !== null && selfId){
      loadFriends();
      setMetadata(oldMetadata => ({...oldMetadata, online: true}));
    }
  }, [selfId])

  useEffect(() => {
    const subscribeToConversations = async () => {
      const subs = streamr.getSubscriptions();
      //Subscribe to stream after messages were resent
      await Promise.all(friends.map(async (friend) => {
        //Check if friend streamID is empty & check if we are already subscribed
        if(friend.streamID !== "" && (!subs.some((sub) => sub.streamId === friend.streamID) || subs.length === 0)){
          await streamr.subscribe(
            {
              stream: friend.streamID,
            }, (data: MessageData) => {
              //Create a new notification if the new message was not sent by us & interface is not visible
              if(data.sender !== account && document.visibilityState !== "visible"){
                const notification = new Notification(getSelectedFriend().hasOwnProperty("profile")
                ? getSelectedFriend().profile.name
                : `${data.sender} sent you a message!`, {body: data.message, icon: getSelectedFriend().profile && getSelectedFriend().profile.hasOwnProperty('image')
                ? `https://ipfs.io/ipfs/${getSelectedFriend().profile.image.alternatives[0].src.substring(7, getSelectedFriend().profile.image.alternatives[0].src.length)}`
                : `https://robohash.org/${data.sender}.png?set=set5`});
                setNotifications((oldArr) => [...oldArr, notification]);
              }
              const newFriends = friends.map((e) => {
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
              setFriends(newFriends);
            }
          )
        }
      }))
    }
    const getValidStream = async (_friend: Friends): Promise<string> => {
      try{
        //Check if saved stream is valid, else find a valid one.
        if(_friend.streamID === ""){
          console.log("Create new stream & return id");
          return getOrCreateMessageStream(_friend.address, HyphaType.Hypha, false).then(stream => stream.id).catch(() => "");
        }
        else{
          const ownerStream = streamr.getStream(`${account}/${HyphaType.Hypha}/${_friend.address}`).then(stream => stream.id);
          const friendStream = streamr.getStream(`${_friend.address}/${HyphaType.Hypha}/${account}`).then(stream => stream.id);
          const emptyStream = getOrCreateMessageStream(_friend.address, HyphaType.Hypha, false).then(stream => stream.id).catch(() => "");
          return ownerStream.catch(() => friendStream.catch(() => emptyStream));
        }
      }
      catch(e){
        console.warn(e);
      }
    }
    const setValidStream = async (_friend: Friends) => {
      try{
        const validStream = await getValidStream(_friend);
        const stream = await selfId.client.tileLoader.load(window.localStorage.getItem(localStreamKey));
        const streamFriends:Friends[] = stream.content.friends;
        const newFriends: Friends[] = streamFriends.map((e) => {
          if(_friend.address === e.address){
            e.streamID = validStream
          }
          return e;
        });
        stream.update({friends: [...newFriends]});
      }
      catch(e){
        console.warn(e);
      }
    }
    if(friends.length > 0){
      // setValidStream(friends[1]);
      subscribeToConversations();
    }
  }, [friends])

  async function addFriends(_address: string){
    const newFriend = {
      address: _address,
      streamID: "",
      selected: false,
    }
    //Check local storage for stream key
    if(window.localStorage.getItem(localStreamKey) !== null){
        const stream = await selfId.client.tileLoader.load(window.localStorage.getItem(localStreamKey));
        const streamFriends:Friends[] = stream.content.friends;
        await stream.update({friends: [...streamFriends, newFriend]});
    }
    //Create a new friends stream if there are no previously existing streams & pin it
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
      window.localStorage.setItem(localStreamKey, stream.id.toString());
    }
    setFriends((oldArr) => [...oldArr, newFriend])
  }

  async function deleteFriend(_address: string){
    //Check local storage for stream key
    if(window.localStorage.getItem(localStreamKey) !== null){
      const stream = await selfId.client.tileLoader.load(window.localStorage.getItem(localStreamKey));
      const streamFriends:Friends[] = stream.content.friends;
      //Find index of friend that matches address
      const friendIndex = streamFriends.findIndex((friends) => {
        return friends.address === _address;
      })
      //Remove friend if found
      if(friendIndex > -1){
        streamFriends.splice(friendIndex, 1);
        await stream.update({friends: [...streamFriends]});
        console.log(stream.content.friends);
        setFriends(streamFriends);
      }
    }
  }

  //Selects a new stream to load when friend is clicked
  async function selectFriend(_address: string){
    //Unsubscribe to last friend before selecting next friend (to prevent duplicate messages)
    getSelectedFriend().streamID !== "" && await streamr.unsubscribe(getSelectedFriend().streamID);
    notifications.forEach(notification => {
      notification.close();
    });
    setFriends(friends.map(friend => {
      if(friend.address === _address){
        friend.selected = true;
      }
      else{
        friend.selected = false;
      }
      return friend;
    }));
    //Check if user has browser notifications toggled on
    if(Notification.permission === "default"){
      Notification.requestPermission()
      .then((e) => {
        console.log(Notification.permission);
      })
    }
  }

  const inviteFriend = async (_address: string) => {
    //Check if group already exists
    streamr.getStream(`${account}/hyphae/${_address.substring(_address.length - 4, _address.length)}`)
    //Group exists
    .then(async (stream: Stream) => {
      console.log("Add address to streamr & give access control.");
      try{
        const streamPermissions = await stream.getPermissions();
        console.log(streamPermissions);
        if(streamPermissions.find(permission => permission.user === _address)){
          console.log("User has permissions already.");
        }
        else{
          console.log("User has no permissions yet");
          await grantPermissions(stream, _address, PermissionType.Owner);
        }
      }
      catch(e){
        console.log("Failed to invite user.");
        console.log(e);
      }
    })
    //Group doesn't exist yet
    .catch(async () => {
      console.log("The group does not exist.");
      const stream = await getOrCreateMessageStream(_address, HyphaType.Hyphae, false);
      console.log(stream);
      // streamr.subscribe(selectedFriend.streamID);
    })
  }

  //Load messages on startup & subscribe to stream
  // useEffect(() => {
  //   async function loadMessages() {
  //     try {
  //       let timeoutID;
  //       const dataArr: MessageData[] = [];
  //       const stream = await streamr.getStream(getSelectedFriend().streamID);
  //       const storageNodes = await stream.getStorageNodes();
  //       //Load the last 50 messages from previous session if messages are being stored
  //       if(storageNodes.length !== 0){
  //         await streamr.resend(
  //           {
  //             stream: getSelectedFriend().streamID,
  //             resend: {
  //               last: 50,
  //             },
  //           }, (data) => {
  //             //Collect all data
  //             dataArr.push(data);
  //             //Reset timer if all data hasn't been gathered yet
  //             if(timeoutID)
  //             clearInterval(timeoutID);
  //             timeoutID = setTimeout(() => {
  //               //Load messages after all data has been collected
  //               setMessages((oldArr) => [...oldArr, ...dataArr]);
  //             }, 100);
  //           }
  //         )
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   //Load if the user wallet is connected
  //   if(account && messages.length === 0  && getSelectedFriend().streamID !== ""){
  //     loadMessages();
  //   }
  // }, [account, friends.find(friend => friend.selected)])

  //Publish a message to stream
  const addMessage = async (_messageText: string, _messageDate: Date) => {
    try{
      const stream = await streamr.getStream(getSelectedFriend().streamID);
      await stream.publish({
        sender: account,
        message: _messageText,
        date: _messageDate
      })
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

  function clickMessage(_message: MessageData){
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

  //Formats eth balance removing extra decimals
  const formatEthBalance = () => {
    try {
      return formatEther(etherBalance);
    } catch (e) {
      return "";
    }
  };

  const getSelectedFriend = () => {
    return friends.length > 0 && friends.find(friend => friend.selected) ? friends.find(friend => friend.selected) : { address: "", streamID: "", selected: false };
  }

  const [metadata, setMetadata] = useMetadata(getSelectedFriend().streamID);

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
      console.log(await streamr.getStream(`${account}/hypha-messages/${friends[0].address}`));
      console.log(await streamr.getUserInfo());
    }
    catch(e){
      console.error(e);
    }
  }

  return (
    <>
      <Head>
        <title>Hypha</title>
        <meta name="description" content="Hypha Messaging" />
        <link rel="icon" href="../favicon.ico" />
      </Head>

      {/* Top Bar */}

      <section id={styles.topBar}>
          <Link href="/">
            <a className="logoContainer">
              <HyphaLogo/>
            </a>
          </Link>
        <div>
          <p>{getSelectedFriend().hasOwnProperty("profile") ? getSelectedFriend().profile.name : getSelectedFriend().address !== "" ? getSelectedFriend().address : "Select A Friend"}</p>
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
              <p>Friends List</p>
              {friends.map((friend) => {
                return (
                  <Tooltip key={Math.random()} content={friend.address}>
                    <Friend
                      key={Math.random()}
                      friend={friend}
                      metadata={metadata}
                      inviteFriend={(address: string) => inviteFriend(address)}
                      selectFriend={(address: string) => selectFriend(address)}
                      deleteFriend={(address: string) => deleteFriend(address)}
                    />
                  </Tooltip>
                );
              })}
              <Group
                key={Math.random()}
                profile={"test profile"}
                selected={false}
                name={"test group"}
                streamID={"test stream"}
                clickGroup={() => console.log("Group Clicked")}
                deleteGroup={() => console.log("Delete Group")}
              />
            </div>
          </section>

          <section id={styles.profile}>
            <div id={styles.connectArea}>
              <div>
                <div id={styles.currentActivity}>
                  <Settings
                    selfId={selfId}
                    address={account}
                    show={settingsModal}
                    cancel={() => setSettingsModal(false)}
                  />
                  <button className="hypha-button" onClick={() => {setSettingsModal(!settingsModal)}}>Settings</button>
                </div>
              </div>
            </div>
            <div>
              <Tooltip content={account}>
                <ConnectButton
                  profile={profile}
                  address={account}
                  connect={connect}
                  disconnect={disconnect}
                />
              </Tooltip>
              <p>
                {account !== undefined ? 
                (formatEthBalance().substring(0, 6) + " Ethereum") : "Connect Wallet"}
              </p>
            </div>
          </section>
        </section>

        <section id={styles.messagesContainer}>
          <div>
            <div>
              {getSelectedFriend().hasOwnProperty("messages") ? getSelectedFriend().messages.filter(e => e.message.includes(searchKey)).map((message: MessageData) => {
                return (
                  <Message
                    key={Math.random()}
                    profile={message.sender === account ? profile : friends.find(friend => friend.address === message.sender).profile}
                    postedData={message}
                    userAddress={account}
                    clickMessage={(message: MessageData) => clickMessage(message)}
                    deleteMessage={(message: MessageData) => deleteMessage(message)}
                    openMessageContext={(message: MessageData) => openMessageContext(message)}
                  />
                );
              }) : <></>}
            </div>
          </div>
          <SendMessage
            disable={!getSelectedFriend().selected}
            typing={(typing: boolean) => setMetadata(oldMetadata => ({...oldMetadata, typing: typing}))}
            sendMessage={(messageText: string, messageDate: Date) => addMessage(messageText, messageDate)}
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
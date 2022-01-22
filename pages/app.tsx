declare let window: any;

import React, { useEffect, useState } from "react";
import styles from '../styles/app.module.css'
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { ethers } from "ethers";

import { ConnectButton } from "../components/ConnectButton";
import { Message } from "../components/Message";
import { Friend } from "../components/Friend";
import { SendMessage } from "../components/SendMessage";
import { FriendModal } from "../components/FriendModal";
import { Settings } from "../components/Settings";

import { EthereumAuthProvider, SelfID } from '@self.id/web';
import getOrCreateMessageStream, {streamr} from "../services/Streamr_API"

function App({ data }) {
  const { account, activateBrowserWallet, deactivate } = useEthers();
  const etherBalance = useEtherBalance(account);

  const [selfId, setSelfId] = useState<SelfID>();

  //Component Constructors
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([])
  const [friendModal, setFriendModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState({address: "Select A Friend", streamID: ""});
  const [loaded, setLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    const connect = async () => {
      if(account){
        try{
          await streamr.connect()
          setSelfId(await SelfID.authenticate({
            authProvider: new EthereumAuthProvider(window.ethereum, account),
            ceramic: 'testnet-clay',
            connectNetwork: 'testnet-clay',
          }))
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
    setMessages([]);
    setFriends([]);
    setLoaded(false);
    notifications.forEach(notification => {
      notification.close();
    });
    setSelectedFriend({address: "Select A Friend", streamID: ""});
    if(streamr){
      streamr.getSubscriptions().forEach(async (sub) => await sub.unsubscribe());
      await streamr.disconnect()
    }
  };

  useEffect(() => {
    function loadFriends() {
      try {
        const friendArr = [];
        //Load friends from local storage
        for(const key in window.localStorage){
          if(key.includes("hypha-friends")){
            friendArr.push(JSON.parse(window.localStorage.getItem(key)));
          }
        }
        if(friendArr.length > 0)
        setFriends([...friendArr]);

      } catch (err) {
        console.log(err);
      }
    }
    //Load if the user wallet is connected
    if(account){
      loadFriends();
    }
  }, [account])

  //Add a new friend to list
  function addFriends(address) {
    const storageKey = "hypha-friends-" + address;
    const friend = {
      address: address,
      streamID: "",
    }
    if(window.localStorage.getItem(storageKey) === null && ethers.utils.isAddress(address)){
      window.localStorage.setItem(storageKey, JSON.stringify(friend));
      setFriends((oldArr) => [...oldArr, friend]);
    }
  }

  //Delete a friend from list
  function deleteFriend(address){
    const storageKey = "hypha-friends-" + address;
    window.localStorage.removeItem(storageKey);
    const friendArr = [];
    for(const key in window.localStorage){
      if(key.includes("hypha-friends")){
        friendArr.push(window.localStorage.getItem(key))
      }
    }
    setFriends(friendArr);
  }

  //Selects a new stream to load when friend is clicked
  async function clickFriend(address){
    //Unsubscribe to last friend before selecting next friend (to prevent duplicate messages)
    selectedFriend.streamID !== "" && await streamr.unsubscribe(selectedFriend.streamID);
    setMessages([]);
    setLoaded(false);
    notifications.forEach(notification => {
      notification.close();
    });
    const storageKey = "hypha-friends-" + address;
    setSelectedFriend(JSON.parse(window.localStorage.getItem(storageKey)));
    streamr.getStream(account.toLowerCase() + "/hypha-messages/" + address)
    //Owner stream exists
    .then(async (stream) => {
      console.log("Owner's stream exists " + stream.id);
      setSelectedFriend((oldObj) => ({...oldObj, streamID: stream.id}))
    })
    //Owner stream does not exist
    .catch(async () => {
      await streamr.getStream(address.toLowerCase() + "/hypha-messages/" + account)
      //Friend stream exists
      .then(async (stream) => {
        console.log("Friend's stream exists " + stream.id);
        setSelectedFriend((oldObj) => ({...oldObj, streamID: stream.id}))
      })
      //Friend stream doesn't exist
      .catch(async () => {
        console.log("Neither stream exists - Creating a new one")
        //Create a message stream
        const stream = await getOrCreateMessageStream(address, false);
        setSelectedFriend((oldObj) => ({...oldObj, streamID: stream.id}))
      })
    })
    //Check if user has browser notifications toggled on
    if(Notification.permission === "default"){
      Notification.requestPermission()
      .then((e) => {
        console.log(Notification.permission);
      })
    }
  }

  //Load messages on startup & subscribe to stream
  useEffect(() => {
    async function loadMessages() {
      try {
        let timeoutID;
        const dataArr = [];
        const stream = await streamr.getStream(selectedFriend.streamID);
        const storageNodes = await stream.getStorageNodes();
        //Load the last 50 messages from previous session if messages are being stored
        if(storageNodes.length !== 0){
          await streamr.resend(
            {
              stream: selectedFriend.streamID,
              resend: {
                last: 50,
              },
            }, (data) => {
              //Collect all data
              dataArr.push(data);
              //Reset timer if all data hasn't been gathered yet
              if(timeoutID)
              clearInterval(timeoutID);
              timeoutID = setTimeout(() => {
                //Load messages after all data has been collected
                setMessages((oldArr) => [...oldArr, ...dataArr]);
              }, 100);
            }
          )
          setLoaded(true);
        }
        //Messages are not stored, but we will still load
        else{
          setLoaded(true);
        }
        //Subscribe to stream after messages were resent
        streamr.subscribe(
          {
            stream: selectedFriend.streamID,
          }, (data, metaData) => {
            //Create a new notification if the new message was not sent by us & interface is not visible
            if(data.sender !== account && document.visibilityState !== "visible"){
              const notification = new Notification(data.sender + " sent you a message!", {body: data.message, icon: "https://robohash.org/" + data.sender + ".png?set=set5"});
              setNotifications((oldArr) => [...oldArr, notification]);
            }
            setMessages((oldArr) => [...oldArr, data]);
          }
        )
      } catch (err) {
        console.log(err);
      }
    }
    //Load if the user wallet is connected
    if(account && messages.length === 0  && selectedFriend.streamID !== ""){
      loadMessages();
    }
  }, [account, selectedFriend]) // eslint-disable-line react-hooks/exhaustive-deps

  //Publish a message to stream
  const addMessage = async (messageText, messageDate) => {
    try{
      const stream = await streamr.getStream(selectedFriend.streamID);
      await stream.publish({
        sender: account,
        message: messageText,
        date: messageDate
      })
    }
    catch(err){
      alert("Please connect your wallet before using Hypha.");
      console.log(err);
    }
  };

  //Delete a message
  async function deleteMessage(msg){
    console.log("Delete: " + msg.message)
  }

  function clickMessage(msg){
    try {
      console.log(msg);
    } catch (e) {
      console.error(e)
    }
  }

  //Opens message context menu
  function openMessageContext(msg){
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

  //Ceramic testing
  async function testCeramic(){

    const doc = await selfId.client.tileLoader.create(
      {
        friends: 'Test Friend',
      },
      {
        tags: ['friends'],
      },
    );

    console.log(doc.commitId);

    const docLoad = await selfId.client.tileLoader.load(doc.id);

    console.log(docLoad.content);
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
        <div>
          <Link href="/">
            <a className="logoContainer">
              <Image src="/hypha-01.png" alt="Hypha Logo" layout="fill" objectFit="contain" priority />
            </a>
          </Link>
        </div>
        <div>
          <p>{selectedFriend.address}</p>
        </div>
        <div>
          <input type="text" placeholder="Search..."></input>
        </div>
        <div>
          <button className="hypha-button" onClick={async () => testCeramic()}>Notifications</button>
        </div>
      </section>

      {/* Content Section */}

      <section id={styles.content}>
        <section id={styles.sidebarContainer}>
          <section id={styles.browserServers}>
            <FriendModal
              show={friendModal}
              addFriend={(address) => {
                setFriendModal(false);
                addFriends(address);
              }}
              cancel={() => setFriendModal(false)}
            />
            <button className="hypha-button" onClick={() => {setFriendModal(!friendModal)}}>Add Friends</button>
          </section>

          <section id={styles.friendsList}>
            <div>
              <p>Friends List</p>
              {friends.map((friend) => {
                return (
                  <Friend
                    key={Math.random()}
                    selected={selectedFriend.address === friend.address}
                    address={friend.address}
                    streamID={friend.streamID}
                    clickFriend={(address) => clickFriend(address)}
                    deleteFriend={(address) => deleteFriend(address)}
                  />
                );
              })}
            </div>
          </section>

          <section id={styles.profile}>
            <div id={styles.connectArea}>
              <div>
                <div id={styles.currentActivity}>
                  <Settings
                    profile={selfId}
                    address={account}
                    show={settingsModal}
                    cancel={() => setSettingsModal(false)}
                  />
                  <button className="hypha-button" onClick={() => {setSettingsModal(!settingsModal)}}>Settings</button>
                </div>
              </div>
            </div>
            <div>
              <ConnectButton
                profile={selfId}
                address={account}
                connect={connect}
                disconnect={disconnect}
              />
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
              {messages.map((message) => {
                return (
                  <Message
                    key={Math.random()}
                    postedData={message}
                    userAddress={account}
                    clickMessage={(msg) => clickMessage(msg)}
                    deleteMessage={(msg) => deleteMessage(msg)}
                    openMessageContext={(msg) => openMessageContext(msg)}
                  />
                );
              })}
            </div>
          </div>
          <SendMessage
            disabled={!loaded}
            sendMessage={(messageText, messageDate) =>
              addMessage(messageText, messageDate)
            }
          />
        </section>
      </section>
    </>
  );
}

export async function getServerSideProps(){ 
  return { props: {} }
}

export default App;
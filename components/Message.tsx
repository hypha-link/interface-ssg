import React, { useState } from "react";
import styles from '../styles/Message.module.css';
import Image from "next/image";
import { TokenFeed } from "./TokenFeed";
import ContextMenu from "./ContextMenu";
import { useEthers } from "@usedapp/core";
import { BasicProfile } from "@datamodels/identity-profile-basic";
import { MessageData } from "./utilities/Types";

export function Message(props) {
  const { profile, payload }:
  {
    profile: BasicProfile,
    payload: MessageData,
  } = props;
  const { account } = useEthers();
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0});

  const urlRegex = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g);
  const message = payload.message;

  const imgArr = [];
  const linkArr = [];
  const tokenFeedArr = [];
  const regularMessage = [];

  //Check for IPFS media
  if(message.includes("ipfs")){
    imgArr.push(
      <Image key={Math.random()} src={message} alt={message} width="200px" height="200px" objectFit="contain"/>
    )
  }
  //Check for URLs
  else if(message.match(urlRegex) !== null) {
    const link = message.match(urlRegex).toString();
    linkArr.push(
      <a key={Math.random()} href={link} target="_blank" rel="noreferrer">
        {link}
      </a>
    );
  }
  //Check for price feed
  else if(message.startsWith("[") && message.endsWith("]")){
    tokenFeedArr.push(
      <TokenFeed
        key={Math.random()}
        onClick={() => console.log(message)}
        tokenName={message.substring(1, message.indexOf(","))}
        tokenPrice={message.substring(message.indexOf(",") + 1, message.length - message.indexOf(",") + 3)}
        hideLiveFeedCheckbox={false}
      />
    )
  }
  //Add message if nothing else matches
  else{
    regularMessage.push(
      <p id={styles.messageText} key={Math.random()}>
        {message}
      </p>
    )
  }

  return (
    <div
      className={payload.sender === account ? `${styles.message} ${styles.own}` : styles.message}
      onClick={() => props.selectMessage(payload)}
      onContextMenu={(e) => {
            setTimeout(() => setAnchorPoint({x: e.pageX, y: e.pageY}), 1);
            e.preventDefault();
      }}
    >
      <ContextMenu 
      anchorPoint={{x: anchorPoint.x, y: anchorPoint.y}}
      localAnchorPoint={(ap) => setAnchorPoint(ap)}
      copy={() => {navigator.clipboard.writeText(payload.message)}}
      delete={() => {props.deleteMessage(payload)}}
      />
      <Image src={profile?.image?.alternatives[0].src ? `https://ipfs.io/ipfs/${profile.image.alternatives[0].src.substring(7, profile.image.alternatives[0].src.length)}` : `https://robohash.org/${payload.sender}.png?set=set5`} alt="User" height="100%" width="100%" objectFit="contain" />
      <div>
        <div>
          <p id={styles.messageID}>{profile?.name ? profile.name : payload.sender}</p>
          <p id={styles.messageDate}>{payload.date}</p>
        </div>
        {/* Message Content */}
        {imgArr}
        {linkArr}
        {tokenFeedArr}
        {regularMessage}
      </div>
    </div>
  );
}

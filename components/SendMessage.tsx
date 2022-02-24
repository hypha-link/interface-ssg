import React, { useState } from "react";
import styles from '../styles/SendMessage.module.css'
import { MessageContext } from "./MessageContext";
import { ChainlinkFeeds } from "./ChainlinkFeeds";
import { EmojiMenu } from "./EmojiMenu";

const IPFS = require('ipfs');

export const SendMessage = ( props ) => {
  const { disable, } :
  {
    disable: boolean,
  } = props;
  const [inputValue, setInputValue] = useState("");
  const [showContext, setShowContext] = useState<any>();
  const [showEmojiMenu, setShowEmojiMenu] = useState<any>();
  const [showChainlinkFeeds, setShowChainlinkFeeds] = useState<any>();

  const keyHandler = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {

      //createMessage();
      props.sendMessage(inputValue);
      setInputValue("");
      props.typing(false);
    }
  };

  const buttonHandler = (e) => {
    if (inputValue.trim() !== ""){

      //createMessage();
      props.sendMessage(inputValue);
      setInputValue("");
      props.typing(false);
    }
  };

  const inputChangeHandler = (e) => {
    setInputValue(e.target.value);
    props.typing(e.target.value !== "");
  }

  function createChainlinkFeeds(e){
    if(e._reactName === 'onClick' && showChainlinkFeeds === undefined){
      setShowChainlinkFeeds(
        <ChainlinkFeeds
          value={(val) => {
            setInputValue(inputValue + val);
            createChainlinkFeeds("");
            }}
          onBlur={(e) => createChainlinkFeeds(e)}
        />
      )
    }
    else{
      setShowChainlinkFeeds(undefined);
    }
  }

  function createEmojiMenu(e){
    if(e._reactName === 'onClick' && showEmojiMenu === undefined){
      setShowEmojiMenu(
        <EmojiMenu
          value={(val) => {
            setInputValue(inputValue + val);
            createEmojiMenu("");
          }}
          onBlur={(e) => createEmojiMenu(e)}
        />
      )
    }
    else{
      setShowEmojiMenu(undefined);
    }
  }

  function createMessageContext(e){
    if(e.target.value.length >= 3 && (e.target.value[0] === ":" || e.target.value[0] === "/")){
      console.log("Open message context");
      setShowContext(
      <MessageContext
        value={(val) => setInputValue(inputValue + val)}
        onBlur={(e) => createMessageContext(e)}
      />
      );
    }
    else{
      setShowContext(undefined);
    }
  }

  async function onChange(e) {
    try {
      const ipfs = await IPFS.create({ repo: "uploaded-files"});
      const file = e.target.files[0]
      const uploadedFile = ipfs.add(file);
      uploadedFile.then((res) => {
        props.sendMessage("https://ipfs.io/ipfs/" + res.path);
      });
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  return (
    <section id={styles.sendMessage}>
      <div>
        <label id={styles.addFileLabel} htmlFor={styles.addFile}>+</label>
        <input id={styles.addFile} type="file" onChange={onChange} disabled={disable}></input>
      </div>
      <input
        id={styles.messageText}
        name="message"
        type="text"
        placeholder="Message"
        autoComplete="off"
        value={inputValue}
        onChange={(e) => inputChangeHandler(e)}
        onInput={(e) => createMessageContext(e)}
        onKeyPress={(e) => keyHandler(e)}
        disabled={disable}
      />
      {showContext}
      <button
        id={styles.chainlinkFeed}
        onClick={(e) => createChainlinkFeeds(e)}
        disabled={disable}
      >&#x2B21;</button>
      {showChainlinkFeeds}
      <button
        id={styles.pickEmoji}
        onClick={(e) => createEmojiMenu(e)}
        disabled={disable}
      >&#x1F60A;</button>
      {showEmojiMenu}
      <button
        id={styles.messageSubmit} 
        onClick={(e) => buttonHandler(e)}
        disabled={disable}
      >Submit</button>
    </section>
  );
};
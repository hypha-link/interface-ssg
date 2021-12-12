import React, { useState } from "react";
import { MessageContext } from "./MessageContext";
import { ChainlinkFeeds } from "./ChainlinkFeeds";
import { EmojiMenu } from "./EmojiMenu";

const IPFS = require('ipfs');

export const SendMessage = ( props ) => {
  const [inputValue, setInputValue] = useState("");
  const [showContext, setShowContext] = useState();
  const [showEmojiMenu, setShowEmojiMenu] = useState();
  const [showChainlinkFeeds, setShowChainlinkFeeds] = useState();

  const keyHandler = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {

      //createMessage();
      props.sendMessage(inputValue, new Date().toString());
      setInputValue("");
    }
  };

  const buttonHandler = (e) => {
    if (inputValue.trim() !== ""){

      //createMessage();
      props.sendMessage(inputValue, new Date().toString());
      setInputValue("");
    }
  };

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
        props.sendMessage("https://ipfs.io/ipfs/" + res.path, new Date().toString());
      });
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  return (
    <section id="send-message">
      <div>
        <label id="add-file-label" htmlFor="add-file">+</label>
        <input id="add-file" type="file" onChange={onChange} disabled={props.disabled}></input>
      </div>
      <input
        id="message-text"
        name="message"
        type="text"
        placeholder="Message"
        autoComplete="off"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onInput={(e) => createMessageContext(e)}
        onKeyPress={(e) => keyHandler(e)}
        disabled={props.disabled}
      ></input>
      {showContext}
      <button id="chainlink-feed"
        onClick={(e) => createChainlinkFeeds(e)}
        disabled={props.disabled}
      >&#x2B21;</button>
      {showChainlinkFeeds}
      <button id="pick-emoji"
        onClick={(e) => createEmojiMenu(e)}
        disabled={props.disabled}
      >&#x1F60A;</button>
      {showEmojiMenu}
      <button id="message-submit" 
      onClick={(e) => buttonHandler(e)}
      disabled={props.disabled}
      >Submit</button>
    </section>
  );
};
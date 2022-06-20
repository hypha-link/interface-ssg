import React, { useContext, useEffect, useMemo, useState } from "react";
import styles from '../styles/sendmessage.module.css'
import { MessageContext } from "./MessageContext";
import { ChainlinkFeeds } from "./ChainlinkFeeds";
import { EmojiMenu } from "./EmojiMenu";
import { StateContext } from "./context/AppState";

type SendMessageProps = {
  disable: boolean
  typing: (typing: boolean) => void
  sendMessage: (messageText: string) => void
}

export const SendMessage = ( {disable, typing, sendMessage} : SendMessageProps ) => {
  const { ipfs } = useContext(StateContext);
  const [inputValue, setInputValue] = useState("");
  const [showMessageContext, setShowMessageContext] = useState<string>('');
  const [showEmojiMenu, setShowEmojiMenu] = useState<boolean>(false);
  const [showChainlinkFeeds, setShowChainlinkFeeds] = useState<boolean>(false);

  const keyHandler = (keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
    if (keyEvent.key === "Enter" && inputValue.trim() !== "") {
      sendMessage(inputValue);
      setInputValue("");
      typing(false);
    }
  };

  const buttonHandler = () => {
    if (inputValue.trim() !== ""){
      sendMessage(inputValue);
      setInputValue("");
      typing(false);
    }
  };

  const inputChangeHandler = (value: string) => {
    setInputValue(value);
    typing(value !== '' && !value.startsWith('@') && !value.startsWith(':') && !value.startsWith('/'));
  }

  async function onChange(currentTarget: EventTarget & HTMLInputElement) {
    console.log(currentTarget.files[0].name);
    try {
      //Upload file, wait until completed, then send message
      ipfs.add(
        {
          path: currentTarget.files[0].name,
          content: currentTarget.files[0]
        }, 
        {
          wrapWithDirectory: true
        }
      ).then((res) => {
        sendMessage(`https://ipfs.io/ipfs/${res.cid.toString()}/${currentTarget.files[0].name}`);
        console.log(res);
      });
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  return (
    <section id={styles.sendMessage}>
      <div>
        <label id={styles.addFileLabel} htmlFor={styles.addFile}>+</label>
        <input id={styles.addFile} type="file" onChange={({currentTarget}) => onChange(currentTarget)} disabled={disable}></input>
      </div>
      <input
        id={styles.messageText}
        name="message"
        type="text"
        placeholder="Message"
        autoComplete="off"
        value={inputValue}
        onChange={({currentTarget}) => inputChangeHandler(currentTarget.value)}
        onInput={({currentTarget}) => setShowMessageContext(currentTarget.value)}
        onKeyPress={(keyEvent) => keyHandler(keyEvent)}
        disabled={disable}
      />
      <MessageContext
        show={showMessageContext}
        value={(value: string) => setInputValue(inputValue + value)}
        cancel={() => setShowMessageContext('')}
      />
      <button
        id={styles.chainlinkFeed}
        onClick={() => setShowChainlinkFeeds(!showChainlinkFeeds)}
        disabled={disable}
      >&#x2B21;</button>
      <ChainlinkFeeds
        show={showChainlinkFeeds}
        value={(value: string) => {
          setInputValue(inputValue + value);
        }}
        cancel={() => setShowChainlinkFeeds(!showChainlinkFeeds)}
      />
      <button
        id={styles.pickEmoji}
        onClick={() => setShowEmojiMenu(!showEmojiMenu)}
        disabled={disable}
      >&#x1F60A;</button>
      <EmojiMenu
        show={showEmojiMenu}
        value={(value: string) => {
          setInputValue(inputValue + value);
        }}
        cancel={() => setShowEmojiMenu(!showEmojiMenu)}
      />
      <button
        id={styles.messageSubmit} 
        onClick={() => buttonHandler()}
        disabled={disable}
      >Submit</button>
    </section>
  );
};
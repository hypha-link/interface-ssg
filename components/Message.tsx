import React, { useContext, useEffect, useState } from "react";
import styles from '../styles/message.module.css';
import { TokenFeed } from "./TokenFeed";
import ContextMenu from "./ContextMenu";
import { MessagePayload } from "./utils/Types";
import { StateContext } from "./context/AppState";
import useSelectedConversation from "./hooks/useSelectedConversation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import emoji from "remark-emoji";
import remarkImages from "remark-images";
import ProfilePicture from "./ProfilePicture";

type MessageProps = {
  payload: MessagePayload
  selectMessage: (payload: MessagePayload) => void
  deleteMessage: (payload: MessagePayload) => void
}

export function Message({payload, selectMessage, deleteMessage}: MessageProps) {
  const { message, sender, date } = payload;
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0});
  const selectedConversation = useSelectedConversation();
  const { ownProfile } = useContext(StateContext);
  //Message that has been edited prior to markdown modification
  const [editedMessage, setEditedMessage] = useState(message);

  //Set to owner profile, otherwise set to address that matches profile
  const profile = sender === ownProfile.address ? ownProfile : selectedConversation.profile.find(_profile => _profile.address === sender);
  //Regex that finds all price feeds in the message
  const priceFeedRegex = /\[[a-zA-Z0-9]+,[0-9]*\.[0-9]+\]/g;
  //Price feeds array
  const tokenFeedArr: JSX.Element[] = [];

  //Check for price feed
  if(message.match(priceFeedRegex)){
    message.match(priceFeedRegex).forEach(feed => {
      //Add the feed to message
      tokenFeedArr.push(
        <TokenFeed
          key={Math.random()}
          onClick={() => console.log(message)}
          tokenName={feed.substring(1, feed.indexOf(","))}
          tokenPrice={feed.substring(feed.indexOf(",") + 1, feed.indexOf("]"))}
          hideLiveFeedCheckbox={false}
        />
      )
    });
  }

  //Remove feed shortcode from the message
  useEffect(() => setEditedMessage(message.replaceAll(priceFeedRegex, '')), [tokenFeedArr]);

  return (
    <div
      className={sender === profile.address ? `${styles.message} ${styles.own}` : styles.message}
      onClick={() => selectMessage(payload)}
      onContextMenu={(e) => {
            setTimeout(() => setAnchorPoint({x: e.pageX, y: e.pageY}), 1);
            e.preventDefault();
      }}
    >
      <ContextMenu 
      anchorPoint={{x: anchorPoint.x, y: anchorPoint.y}}
      localAnchorPoint={(ap) => setAnchorPoint(ap)}
      copy={async () => {navigator.clipboard.writeText(message)}}
      delete={() => {deleteMessage(payload)}}
      />
      <ProfilePicture profile={profile} sizePx={75}/>
      <div>
        <div>
          <p id={styles.messageID}>{profile?.name ? profile.name : sender}</p>
          <p id={styles.messageDate}>{date}</p>
        </div>
        {/* Message Content */}
        {tokenFeedArr}
        <ReactMarkdown
          remarkPlugins={[[remarkGfm], [emoji, {emoticon: true}], [remarkImages]]}
          linkTarget={"_blank"}
        >
          {editedMessage}
        </ReactMarkdown>
      </div>
    </div>
  );
}

import styles from '../../styles/conversation.module.css'
import { useSendTransaction } from '@usedapp/core';
import React, { useState } from 'react'
import { Conversations } from '../utils/Types';
import ProfilePicture from '../ProfilePicture';
import { Tooltip } from '../utils/Tooltip';
import ContextMenu from '../ContextMenu';
import { utils } from 'ethers';
import getConversationProfile from '../../get/getConversationProfile';
import getConversationName from '../../get/getConversationName';

type HyphaProps = {
  conversation: Conversations
  inviteConversation?: (conversation: Conversations) => void
  selectConversation: (conversation: Conversations) => void
  deleteConversation?: (conversation: Conversations) => void
}

export default function Hypha({conversation, inviteConversation, selectConversation, deleteConversation}: HyphaProps) {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const { sendTransaction } = useSendTransaction();
  const profile = getConversationProfile(conversation);

  return (
    <div
      className={styles.conversation}
      onClick={() => {
        //If not selected, allow user to select conversation
        !conversation.selected && selectConversation(conversation);
      }}
      onContextMenu={(e) => {
        setTimeout(() => setAnchorPoint({ x: e.pageX, y: e.pageY }), 1);
        e.preventDefault();
      }}
    >
      <Tooltip key={Math.random()} content={profile?.address}>
        <ProfilePicture profile={profile} metadata={conversation.metadata}/>
        <p>
          {getConversationName(conversation)}
        </p>
      </Tooltip>
      <ContextMenu
        anchorPoint={{ x: anchorPoint.x, y: anchorPoint.y }}
        localAnchorPoint={(ap) => setAnchorPoint(ap)}
        //If not selected, allow user to select conversation
        select={() =>
          !conversation.selected && selectConversation(conversation)
        }
        view={() =>
          console.log(conversation || "No profile exists.")
        }
        invite={() => inviteConversation(conversation)}
        send={() => {
          sendTransaction({
            to: profile.address,
            value: utils.parseEther(".1"),
          });
        }}
        delete={() => deleteConversation(conversation)}
      />
    </div>
  );
}
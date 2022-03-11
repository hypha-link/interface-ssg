import styles from '../../styles/conversation.module.css'
import { shortenIfAddress, useSendTransaction } from '@usedapp/core';
import React, { useState } from 'react'
import { Conversations, Metadata } from '../utils/Types';
import ProfilePicture from '../ProfilePicture';
import { Tooltip } from '../utils/Tooltip';
import ContextMenu from '../ContextMenu';
import { utils } from 'ethers';
import getHyphaProfile from '../../get/getHyphaProfile';

type HyphaProps = {
  conversation: Conversations
  metadata: Metadata
  inviteConversation: (conversation: Conversations) => void
  selectConversation: (conversation: Conversations) => void
  deleteConversation: (conversation: Conversations) => void
}

export default function Hypha({conversation, metadata, inviteConversation, selectConversation, deleteConversation}: HyphaProps) {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const { sendTransaction } = useSendTransaction();
  const profile = getHyphaProfile(conversation);

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
        <ProfilePicture profile={profile} metadata={metadata} />
        <p>
          {profile?.name ? profile.name : shortenIfAddress(profile?.address)}
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
          console.log(
            conversation.profile ? conversation.profile : "User has no profile."
          )
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
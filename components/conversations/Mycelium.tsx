import styles from '../../styles/conversation.module.css'
import React, { useState } from 'react'
import { Conversations, Metadata } from '../utils/Types';
import ProfilePicture from '../ProfilePicture';
import { Tooltip } from '../utils/Tooltip';
import ContextMenu from '../ContextMenu';
import getHyphaProfile from '../../get/getHyphaProfile';

type MyceliumProps = {
  conversation: Conversations
  metadata: Metadata
  inviteConversation: (conversation: Conversations) => void
  selectConversation: (conversation: Conversations) => void
  deleteConversation: (conversation: Conversations) => void
}

export default function Mycelium({conversation, metadata, inviteConversation, selectConversation, deleteConversation}: MyceliumProps) {
    const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0});

  return (
    <div
      className={styles.conversation}
      onClick={() => {
          //If not selected, allow user to select conversation
          !conversation.selected && selectConversation(conversation)
      }} 
      onContextMenu={(e) => {
          setTimeout(() => setAnchorPoint({x: e.pageX, y: e.pageY}), 1);
          e.preventDefault();
      }}
    >
      <Tooltip key={Math.random()} content={conversation.streamId}>
        <ProfilePicture profile={getHyphaProfile(conversation)} metadata={metadata}/>
        <p>{conversation.streamId}</p>
      </Tooltip>
      <ContextMenu 
        anchorPoint={{x: anchorPoint.x, y: anchorPoint.y}} 
        localAnchorPoint={(ap) => setAnchorPoint(ap)}
        //If not selected, allow user to select conversation
        select={() => !conversation.selected && selectConversation(conversation)}
        invite={() => inviteConversation(conversation)}
        leave_mycelium={() => deleteConversation(conversation)}
      />
    </div>
  )
}
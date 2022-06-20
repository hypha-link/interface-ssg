import styles from '../../styles/conversation.module.css'
import React from 'react'
import { Conversations } from '../utils/Types';
import ProfileImage from '../ProfileImage';
import { Tooltip } from '../utils/Tooltip';
import ContextMenu from '../ContextMenu';
import getConversationProfile from '../../get/getConversationProfile';
import getConversationName from '../../get/getConversationName';

type HyphaeProps = {
  conversation: Conversations
  inviteConversation?: (conversation: Conversations) => void
  selectConversation: (conversation: Conversations) => void
  deleteConversation?: (conversation: Conversations) => void
}

export default function Hyphae({conversation, inviteConversation, selectConversation, deleteConversation}: HyphaeProps) {

  return (
    <ContextMenu
      options={[
        {name: 'select', fn: () => !conversation.selected && selectConversation(conversation)},
        {name: 'view', fn: () => console.log(conversation || "No profile exists.")},
        {name: 'invite', fn: () => inviteConversation(conversation)},
        {name: 'leave_hyphae', fn: () => deleteConversation(conversation)}
      ]}
    >
      <div
        className={styles.conversation}
        onClick={() => {
            //If not selected, allow user to select conversation
            !conversation.selected && selectConversation(conversation)
        }} 
      >
        <Tooltip key={Math.random()} content={conversation.streamId}>
          <ProfileImage profile={getConversationProfile(conversation)} metadata={conversation.metadata}/>
          <p>
            {getConversationName(conversation)}
          </p>
        </Tooltip>
      </div>
    </ContextMenu>
  )
}
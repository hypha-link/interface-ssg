import styles from '../../styles/conversation.module.css'
import { useSendTransaction } from '@usedapp/core';
import React, { useContext } from 'react'
import { Conversations } from '../utils/Types';
import ProfileImage from '../ProfileImage';
import { Tooltip } from '../utils/Tooltip';
import ContextMenu from '../ContextMenu';
import { utils } from 'ethers';
import getConversationProfile from '../../get/getConversationProfile';
import getConversationName from '../../get/getConversationName';
import { OcclusionUpdateContext } from '../utils/Occlusion';
import ProfileCard from '../ProfileCard';

type HyphaProps = {
  conversation: Conversations
  inviteConversation?: (conversation: Conversations) => void
  selectConversation: (conversation: Conversations) => void
  deleteConversation?: (conversation: Conversations) => void
}

export default function Hypha({conversation, inviteConversation, selectConversation, deleteConversation}: HyphaProps) {
  const { sendTransaction } = useSendTransaction();
  const profile = getConversationProfile(conversation);
  const setOcclusionState = useContext(OcclusionUpdateContext);

  return (
    <ContextMenu
      options={[
        {name: 'select', fn: () => !conversation.selected && selectConversation(conversation)},
        {name: 'view', fn: () => console.log(conversation || "No profile exists.")},
        {name: 'invite', fn: () => inviteConversation(conversation)},
        {name: 'send', fn: () => {
          sendTransaction({
            to: profile.address,
            value: utils.parseEther(".1"),
          });
        }},
        {name: 'delete', fn: () => deleteConversation(conversation)}
      ]}
    >
      <div
        className={styles.conversation}
        onClick={() => {
          //If not selected, allow user to select conversation
          !conversation.selected && selectConversation(conversation);
        }}
      >
        <Tooltip key={Math.random()} content={profile?.address}>
          <ProfileImage profile={profile} metadata={conversation.metadata} clickFn={() => setOcclusionState(<ProfileCard profile={profile}/>)}/>
          <p>
            {getConversationName(conversation)}
          </p>
        </Tooltip>
      </div>
    </ContextMenu>
  );
}
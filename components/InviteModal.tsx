import React, {useContext, useEffect, useMemo, useState} from 'react'
import getConversationName from '../get/getConversationName';
import { ConversationType } from '../services/Streamr_API';
import styles from '../styles/invitemodal.module.css'
import { StateContext } from './context/AppState'
import { Conversation } from './Conversation';
import usePublishMetadata from './hooks/usePublishMetadata';
import { Conversations } from './utils/Types';

type InviteModalProps = {
  invitedConversation: Conversations
  createHyphae: () => void
  openMyceliumModal: () => void
  cancel: () => void
}

export const InviteModal = ({ invitedConversation, createHyphae, openMyceliumModal, cancel }: InviteModalProps) => {
  const { conversations } = useContext(StateContext);
  const [localConversations, setLocalConversations] = useState<Conversations[]>(conversations);
  const invitee = useMemo(() => localConversations.find((_conversation) => _conversation.selected === true && _conversation.type !== ConversationType.Hypha), [localConversations]);
  const [setMetadata, timeRemaining] = usePublishMetadata(invitedConversation);

  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations])

  const inviteConversation = async (_conversation: Conversations) => {
    console.log(`Invited to ${_conversation.streamId}`);
    setMetadata(oldMetadata => ({...oldMetadata, invite: _conversation.streamId}));
  }

  const selectConversation = async (_conversation: Conversations) => {
    console.log(`Selected ${_conversation.streamId}`);
    setLocalConversations(localConversations.map(conversation => {
      if(conversation.streamId === _conversation.streamId){
        return {
          ...conversation,
          selected: true
        }
      }
      else{
        return {
          ...conversation,
          selected: false
        }
      }
    }))
  }

  const closeWindow = () => {
    setLocalConversations(conversations); 
    cancel();
  }

  return (
    invitedConversation ?
    <div id={styles.inviteModal}>
      <section id={styles.invite}>
        <div>
          <h1 className={styles.title}>Inviting {getConversationName(invitedConversation)} to</h1>
          <div className={styles.inviteContainer}>
            <div>
              <h1>Hyphae</h1>
              {localConversations.filter(_conversation => _conversation.type === ConversationType.Hyphae).map((_conversation) => {
                return (
                  <Conversation
                    key={Math.random()}
                    conversation={_conversation}
                    selectConversation={(_conversation: Conversations) => selectConversation(_conversation)}
                  />
                )
              })}
            </div>
            <div>
              <h1>Mycelium</h1>
              {localConversations.filter(_conversation => _conversation.type === ConversationType.Mycelium).map((_conversation) => {
                return (
                  <Conversation
                    key={Math.random()}
                    conversation={_conversation}
                    selectConversation={(_conversation: Conversations) => selectConversation(_conversation)}
                  />
                )
              })}
            </div>
          </div>
          <button 
          id={styles.inviteButton} 
          className={`${invitee && styles.inviteeSelected} hypha-button`} 
          onClick={() => {
            if(invitee && invitedConversation.metadata.online === true){
              inviteConversation(invitee);
            }
          }}
          disabled={timeRemaining !== 10000}
          >{invitedConversation?.metadata?.online === true ? timeRemaining === 10000 ? 'Invite' : `Please wait ${Math.ceil(timeRemaining / 1000)} seconds before inviting again` : `${getConversationName(invitedConversation)} is offline`}</button>
        </div>
      </section>
      <section id={styles.create}>
        <h1 className={styles.title}>Create</h1>
        <div id={styles.createNew}>
            <>
              <button
              className="hypha-button"
              onClick={() => {
                createHyphae();
                closeWindow();
              }}
              >Hyphae<br/>(up to 10 members)</button>
              <button
              className="hypha-button"
              id={styles.mycelium}
              onClick={() => {
                openMyceliumModal();
                closeWindow();
              }}
              >Mycelium<br/>(for large groups)</button>
            </>
        </div>
      </section>
      <button id={styles.cancel} className='hypha-button' onClick={() => {
        closeWindow();
      }}>X</button>
    </div>
    :
    null
  )
}

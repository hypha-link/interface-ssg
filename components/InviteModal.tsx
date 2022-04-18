import React, {useContext, useEffect, useMemo, useState} from 'react'
import { StreamPermission } from 'streamr-client';
import { ConversationType } from '../services/Streamr_API';
import styles from '../styles/invitemodal.module.css'
import { StateContext } from './context/AppState'
import { Conversation } from './Conversation';
import { Conversations } from './utils/Types';

export const InviteModal = ({invitedConversation, createHyphae, openMyceliumModal, cancel}: { invitedConversation: Conversations, createHyphae: () => void, openMyceliumModal: () => void, cancel: () => void}) => {
  const { conversations, streamr, streamrDelegate } = useContext(StateContext);
  const [localConversations, setLocalConversations] = useState<Conversations[]>(conversations);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const invitee = useMemo(() => localConversations.find((_conversation) => _conversation.selected === true && _conversation.type !== ConversationType.Hypha), [localConversations]);

  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations])

  const inviteConversation = async (_conversation: Conversations) => {
    console.log(`Invited ${_conversation.streamId}`);
    //Grant publish permissions to the delegate if it doesn't have them already
    if(!await streamr.isStreamPublisher(invitedConversation.streamId, streamrDelegate?.wallet.address)){
      await streamr.grantPermissions(invitedConversation.streamId, {
        user: streamrDelegate?.wallet.address,
        permissions: [StreamPermission.PUBLISH],
      })
    }
    streamrDelegate.client.publish(
      {streamId: invitedConversation.streamId, partition: 1},
      {
        inviteTo: _conversation.streamId
      }
    )
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
    setIsCreateNew(false);
    cancel();
  }

  return (
    invitedConversation ?
    <div id={styles.inviteModal}>
        <h1 className={styles.title}>Invite</h1>
        <section>
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
        </section>
        <button id={styles.invite} className={`${invitee && styles.inviteeSelected} hypha-button`} onClick={() => {
          if(invitee){
            inviteConversation(invitee);
            closeWindow();
          }
        }}>Invite</button>
        <h1 className={styles.title}>Create</h1>
        <div id={styles.createNew}>
          {
            isCreateNew ?
            <>
              <button
              className="hypha-button"
              onClick={() => {
                createHyphae();
                closeWindow();
              }}
              >Hyphae</button>
              <button
              className="hypha-button"
              id={styles.mycelium}
              onClick={() => {
                openMyceliumModal();
                closeWindow();
              }}
              >Mycelium</button>
            </>
            :
            <button className="hypha-button" onClick={() => {
              console.log('Create new');
              setIsCreateNew(true);
            }}>Create new Hyphae/Mycelium</button>
          }
        </div>
        <button id={styles.cancel} className='hypha-button' onClick={() => {
          closeWindow();
        }}>X</button>
    </div>
    :
    null
  )
}

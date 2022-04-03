import React, {useContext, useEffect, useState} from 'react'
import { StreamPermission } from 'streamr-client';
import { ConversationType } from '../services/Streamr_API';
import styles from '../styles/invitemodal.module.css'
import { StateContext } from './context/AppState'
import { Conversation } from './Conversation';
import { Conversations } from './utils/Types';

export const InviteModal = ({invitedConversation, cancel}: { invitedConversation: Conversations, cancel: () => void}) => {
  const { conversations, streamr, streamrDelegate } = useContext(StateContext);
  const [localConversations, setLocalConversations] = useState<Conversations[]>(conversations);

  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations])

  const inviteConversation = async (_conversation: Conversations) => {
    console.log(`Invited ${_conversation}`);
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
    console.log(`Selected ${_conversation}`);
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

  return (
    invitedConversation ?
    <div id={styles.inviteModal}>
        <h1>Invite to:</h1>
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
        <h1>Or create a new one!</h1>
        <button className="hypha-button" onClick={() => {
          console.log('Create new');

        }}>Create new Hyphae/Mycelium</button>
        <div>
            <button className="hypha-button" onClick={() => {
              const invitee = localConversations.find((_conversation) => _conversation.selected === true && _conversation.type !== ConversationType.Hypha);
              if(invitee){
                inviteConversation(invitee);
                cancel();
              }
            }}>Invite</button>
            <button className="hypha-button" onClick={() => {
              setLocalConversations(conversations); 
              cancel();
            }}>Close</button>
        </div>
    </div>
    :
    null
  )
}

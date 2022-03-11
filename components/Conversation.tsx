import styles from '../styles/conversation.module.css'
import React from 'react'
import { Conversations, Metadata } from './utils/Types'
import { ConversationType } from '../services/Streamr_API'
import Hypha from './conversations/Hypha'
import Hyphae from './conversations/Hyphae'
import Mycelium from './conversations/Mycelium'

type ConversationProps = {
    conversation: Conversations
    metadata: Metadata
    inviteConversation: (conversation: Conversations) => void
    selectConversation: (conversation: Conversations) => void
    deleteConversation: (conversation: Conversations) => void
}

export const Conversation = ({conversation, metadata, inviteConversation, selectConversation, deleteConversation}: ConversationProps) => {
    return (
        <div
        className = {conversation.selected ? `${styles.conversationContainer} ${styles.selectedConversation}` : styles.conversationContainer}
        >
            {/* Conversation type selector */}
            {
                conversation.type === ConversationType.Hypha ? 
                <Hypha 
                conversation={conversation} 
                metadata={metadata} 
                inviteConversation={inviteConversation} 
                selectConversation={selectConversation} 
                deleteConversation={deleteConversation}
                />
                : conversation.type === ConversationType.Hyphae ? 
                <Hyphae 
                conversation={conversation} 
                metadata={metadata} 
                inviteConversation={inviteConversation} 
                selectConversation={selectConversation} 
                deleteConversation={deleteConversation}
                />
                : conversation.type === ConversationType.Mycelium ? 
                <Mycelium 
                conversation={conversation} 
                metadata={metadata} 
                inviteConversation={inviteConversation} 
                selectConversation={selectConversation} 
                deleteConversation={deleteConversation}
                />
                : 
                <></>
            }
        </div>
    )
}
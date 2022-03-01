import React, { useState } from 'react'
import styles from '../styles/conversation.module.css'
import Image from 'next/image'
import { shortenIfAddress, useSendTransaction } from '@usedapp/core'
import ContextMenu from './ContextMenu'
import { utils } from 'ethers'
import { Conversations, Metadata } from './utils/Types'
import ProfilePicture from './ProfilePicture'

export const Conversation = (props) => {
    const { conversation, metadata, inviteConversation, selectConversation, deleteConversation }: 
    {
        conversation: Conversations,
        metadata: Metadata,
        inviteConversation: (conversation: Conversations) => void,
        selectConversation: (conversation: Conversations) => void,
        deleteConversation: (conversation: Conversations) => void,
    } = props;
    const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0});
    const { sendTransaction } = useSendTransaction();

    return (
        <div 
        className = {conversation.selected ? `${styles.conversationContainer} ${styles.selectedConversation}` : styles.conversationContainer} 
        onClick={() => {
            //If not selected, allow user to select conversation
            !conversation.selected && selectConversation(conversation)
        }} 
        onContextMenu={(e) => {
            setTimeout(() => setAnchorPoint({x: e.pageX, y: e.pageY}), 1);
            e.preventDefault();
        }}
        >
            <ContextMenu 
            anchorPoint={{x: anchorPoint.x, y: anchorPoint.y}} 
            localAnchorPoint={(ap) => setAnchorPoint(ap)}
            //If not selected, allow user to select conversation
            select={() => !conversation.selected && selectConversation(conversation)}
            view={() => console.log(conversation.profile ? conversation.profile : "User has no profile.")}
            invite={() => inviteConversation(conversation)}
            send={() => {
                sendTransaction({ to: conversation.address, value: utils.parseEther(".1")});
            }} 
            delete={() => deleteConversation(conversation)}
            />
            <ProfilePicture conversation={conversation} metadata={metadata} indicator={true}/>
            <p>{conversation.profile?.name ? conversation.profile.name : shortenIfAddress(conversation.address)}</p>
        </div>
    )
}
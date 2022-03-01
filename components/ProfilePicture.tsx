import React from 'react'
import Image from 'next/image';
import styles from '../styles/profilepicture.module.css'
import { Conversations, Metadata } from './utils/Types';
import { Direction, Tooltip } from './utils/Tooltip';
import Typing from './utils/Typing';

export default function ProfilePicture(props) {
    const { conversation, metadata, indicator = false }: 
    {
        conversation: Conversations,
        metadata: Metadata,
        indicator: boolean,
    } = props;
  return (
    <a className={styles.profilePictureContainer} onClick={(e) => {console.log('profile clicked'); e.stopPropagation();}}>
        <Image src={conversation.profile?.image?.alternatives[0].src ? `https://ipfs.io/ipfs/${conversation.profile.image.alternatives[0].src.substring(7, conversation.profile.image.alternatives[0].src.length)}` : `https://robohash.org/${conversation.address}.png?set=set5`} alt="Conversation" height={"100%"} width={"100%"} />
        {/* Show indicator if requested */}
        {indicator 
        ?
        <div>
            <Tooltip content={metadata.online ? 'Online' : 'Offline'} direction={Direction.top} delay={100}>
                <Typing metadata={metadata}/>
            </Tooltip>
        </div> 
        : 
        <></>}
    </a>
  )
}

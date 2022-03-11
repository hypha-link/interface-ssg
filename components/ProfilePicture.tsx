import React from 'react'
import Image from 'next/image';
import styles from '../styles/profilepicture.module.css'
import { Metadata, Profile } from './utils/Types';
import { Direction, Tooltip } from './utils/Tooltip';
import Typing from './utils/Typing';
import getProfileImage from '../get/getProfileImage';

export default function ProfilePicture({profile, metadata, sizePx = 50}: {profile: Profile, metadata?: Metadata, sizePx?: number}) {
    return (
        <a 
        className={styles.profilePictureContainer} 
        style={{maxHeight:sizePx, maxWidth:sizePx, height:sizePx, width: sizePx}} 
        onClick={(e) => {console.log('profile clicked'); e.stopPropagation();}}
        >
            <Image src={getProfileImage(profile)} alt="Conversation" height={"100%"} width={"100%"} />
            {/* Show metadata if valid */}
            {metadata 
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

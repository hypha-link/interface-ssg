import React from 'react'
import styles from '../styles/profileimage.module.css'
import { Metadata, Profile } from './utils/Types';
import { Direction, Tooltip } from './utils/Tooltip';
import Typing from './utils/Typing';
import getProfilePicture from '../get/getProfilePicture';

type ProfileImageProps = {
    profile: Profile
    metadata?: Metadata
    sizePx?: number
    clickFn?: () => void
}

export default function ProfileImage({profile, metadata, sizePx = 50, clickFn}: ProfileImageProps) {
    return (
        <a 
        className={styles.container} 
        style={{maxHeight:sizePx, maxWidth:sizePx, height:sizePx, width: sizePx, cursor: clickFn ? 'pointer' : 'unset'}} 
        onClick={(e) => {
            clickFn();
            e.stopPropagation();
        }}
        >
            <img src={getProfilePicture(profile).image} alt="Conversation" height="100%" width="100%" />
            {/* Show metadata if valid */}
            {
                metadata 
                ?
                <div>
                    <Tooltip content={metadata.online ? 'Online' : 'Offline'} direction={Direction.top} delay={100}>
                        <Typing metadata={metadata}/>
                    </Tooltip>
                </div>
                : 
                <></>
            }
        </a>
    )
}

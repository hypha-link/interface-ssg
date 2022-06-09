import React, { useState } from 'react'
import Image from 'next/image';
import styles from '../styles/profilepicture.module.css'
import { Metadata, Profile } from './utils/Types';
import { Direction, Tooltip } from './utils/Tooltip';
import Typing from './utils/Typing';
import getProfileImage from '../get/getProfileImage';
import ProfileCard from './ProfileCard';

type ProfilePictureProps = {
    profile: Profile
    metadata?: Metadata
    disableClick?: boolean
    sizePx?: number
}

export default function ProfilePicture({profile, metadata, disableClick = true, sizePx = 50}: ProfilePictureProps) {
    const [showProfileCard, setShowProfileCard] = useState(false);
    return (
        <a 
        className={styles.profilePictureContainer} 
        style={{maxHeight:sizePx, maxWidth:sizePx, height:sizePx, width: sizePx, cursor: disableClick ? 'unset' : 'pointer'}} 
        onClick={(e) => {
            if(!disableClick){
                setShowProfileCard(!showProfileCard);
                e.stopPropagation();
            }
        }}
        >
            <Image src={getProfileImage(profile)} alt="Conversation" height="100%" width="100%" layout="raw" />
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
            {
                showProfileCard
                ?
                <ProfileCard profile={profile} float={true}/>
                : 
                <></>
            }

        </a>
    )
}

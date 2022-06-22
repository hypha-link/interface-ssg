import React from 'react'
import getProfilePicture from '../get/getProfilePicture';
import styles from '../styles/profilecard.module.css';
import ProfileImage from './ProfileImage'
import { Tooltip } from './utils/Tooltip'
import { Profile } from './utils/Types'

export default function ProfileCard({ profile, portrait = true } : { profile: Profile, portrait?: boolean }) {
    return (
        <div 
            className={`${styles.card} ${portrait ? styles.portrait : styles.landscape}`} 
            onClick={(e) => e.stopPropagation()}
        >
            <div className={styles.profileBackground} style={{backgroundImage: `url(${getProfilePicture(profile).background})`}}/>
            <div className={styles.contentContainer}>
                <ProfileImage profile={profile} sizePx={128} onClick={() => window.open(`/profile/${profile?.address}`)}/>
                <div className={styles.content}>
                    <Tooltip content={profile?.address}>
                        <h3><a onClick={async () => navigator.clipboard.writeText(profile?.address)}>{profile?.name || profile?.address}</a></h3>
                    </Tooltip>
                    <h5>{profile?.description}</h5>
                </div>
            </div>
        </div>
    )
}
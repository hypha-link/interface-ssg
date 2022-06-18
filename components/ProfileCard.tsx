import Image from 'next/image';
import React from 'react'
import getProfilePicture from '../get/getProfilePicture';
import styles from '../styles/profilecard.module.css';
import ProfileImage from './ProfileImage'
import { Tooltip } from './utils/Tooltip'
import { Profile } from './utils/Types'

export default function ProfileCard({ profile, float = false } : { profile: Profile, float?: boolean }) {
  return (
    float
    ?
    //Float
    <div className={styles.cardWrapper}>
        <div className={`${styles.card} ${styles.float}`}>
            {
                <Image className={styles.profileBackground} src={getProfilePicture(profile).background} alt={'Profile Background'} height='100%' width='100%' layout='raw'/>
            }
            <ProfileImage profile={profile} disableClick={true} sizePx={150}/>
            <Tooltip content={profile?.address}>
                <h3><a onClick={async () => navigator.clipboard.writeText(profile?.address)}>{profile?.name || profile?.address}</a></h3>
            </Tooltip>
            <h5>{profile?.description}</h5>
        </div>
    </div>
    :
    //Embed
    <div className={styles.card}>
        {
            <Image className={styles.profileBackground} src={getProfilePicture(profile).background} alt={'Profile Background'} height='100%' width='100%' layout='raw'/>
        }
        <ProfileImage profile={profile} disableClick={true} sizePx={150}/>
        <Tooltip content={profile?.address}>
            <h3><a onClick={async () => navigator.clipboard.writeText(profile?.address)}>{profile?.name || profile?.address}</a></h3>
        </Tooltip>
        <h5>{profile?.description}</h5>
    </div>
  )
}

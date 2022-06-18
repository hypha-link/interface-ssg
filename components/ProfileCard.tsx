import Image from 'next/image';
import React from 'react'
import getProfileImage from '../get/getProfileImage';
import styles from '../styles/profilecard.module.css';
import ProfilePicture from './ProfilePicture'
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
                <Image className={styles.profileBackground} src={getProfileImage(profile).background} alt={'Profile Background'} height='100%' width='100%' layout='raw'/>
            }
            <ProfilePicture profile={profile} disableClick={true} sizePx={150}/>
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
            <Image className={styles.profileBackground} src={getProfileImage(profile).background} alt={'Profile Background'} height='100%' width='100%' layout='raw'/>
        }
        <ProfilePicture profile={profile} disableClick={true} sizePx={150}/>
        <Tooltip content={profile?.address}>
            <h3><a onClick={async () => navigator.clipboard.writeText(profile?.address)}>{profile?.name || profile?.address}</a></h3>
        </Tooltip>
        <h5>{profile?.description}</h5>
    </div>
  )
}

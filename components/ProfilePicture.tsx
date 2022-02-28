import React from 'react'
import Image from 'next/image';
import styles from '../styles/profilepicture.module.css'
import { Friends, Metadata } from './utilities/Types';
import { Direction, Tooltip } from './utilities/Tooltip';
import Typing from './utilities/Typing';

export default function ProfilePicture(props) {
    const { friend, metadata, indicator = false }: 
    {
        friend: Friends,
        metadata: Metadata,
        indicator: boolean,
    } = props;
  return (
    <a className={styles.profilePictureContainer} onClick={(e) => {console.log('profile clicked'); e.stopPropagation();}}>
        <Image src={friend.profile?.image?.alternatives[0].src ? `https://ipfs.io/ipfs/${friend.profile.image.alternatives[0].src.substring(7, friend.profile.image.alternatives[0].src.length)}` : `https://robohash.org/${friend.address}.png?set=set5`} alt="Friend" height={"100%"} width={"100%"} />
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

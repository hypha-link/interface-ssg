import React, { useEffect, useState }  from 'react'
import styles from '../styles/ConnectButton.module.css'
import Image from 'next/image';
import { shortenIfAddress } from '@usedapp/core'

export const ConnectButton = (props) => {
  const [profile, setProfile] = useState();

  const isConnected = props.address !== "" && props.address !== undefined;

  const loadProfile = async () => {
    setProfile(await props.profile.get('basicProfile'));
  }
  useEffect(() => {
    if(props.profile)
    loadProfile();
  }, [props.profile])
  return (
    <div>
      {isConnected ? (
        <button className={styles.selfProfile} onClick={() => props.disconnect()}>
          <Image src={profile && profile.hasOwnProperty('image') ? `https://ipfs.io/ipfs/${profile.image.alternatives[0].src.substring(7, profile.image.alternatives[0].src.length)}` : `https://robohash.org/${props.address}.png?set=set5`} alt="Profile Image" height={"100%"} width={"100%"} />
          <p>{profile && profile.hasOwnProperty('name') ? profile.name : shortenIfAddress(props.address)}</p>
        </button>
      ) : (
        <button className={styles.selfProfile} onClick={() => props.connect()}>
          <p>Connect</p>
        </button>
      )}
    </div>
  );
};

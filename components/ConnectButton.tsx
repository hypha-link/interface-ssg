import React from 'react'
import styles from '../styles/ConnectButton.module.css'
import Image from 'next/image';
import { shortenIfAddress } from '@usedapp/core'
import { BasicProfile } from '@datamodels/identity-profile-basic';

export const ConnectButton = (props) => {
  const { profile, address }: 
  {
    profile: BasicProfile,
    address: string,
  } = props;
  const isConnected = address !== "" && address !== undefined;

  return (
    <div>
      {isConnected ? (
        <button className={styles.selfProfile} onClick={() => props.disconnect()}>
          <Image src={profile && profile.hasOwnProperty('image') ? `https://ipfs.io/ipfs/${profile.image.alternatives[0].src.substring(7, profile.image.alternatives[0].src.length)}` : `https://robohash.org/${address}.png?set=set5`} alt="Profile Image" height={"100%"} width={"100%"} />
          <p>{profile && profile.hasOwnProperty('name') ? profile.name : shortenIfAddress(address)}</p>
        </button>
      ) : (
        <button className={styles.selfProfile} onClick={() => props.connect()}>
          <p>Connect</p>
        </button>
      )}
    </div>
  );
};

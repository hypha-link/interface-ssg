import React, { useContext } from 'react'
import styles from '../styles/ConnectButton.module.css'
import { shortenIfAddress, useEthers } from '@usedapp/core'
import { StateContext } from './context/AppState';
import ProfilePicture from './ProfilePicture';

export const ConnectButton = (props) => {
  const { profile } = useContext(StateContext);
  const { account } = useEthers();
  const isConnected = account !== "" && account !== undefined;

  return (
    <div>
      {isConnected ? (
        <button className={styles.connectProfile} onClick={() => props.disconnect()}>
          <ProfilePicture conversation={{address: account, profile: profile}}/>
          <p>{profile?.name ? profile.name : shortenIfAddress(account)}</p>
        </button>
      ) : (
        <button className={styles.connectProfile} onClick={() => props.connect()}>
          <p>Connect</p>
        </button>
      )}
    </div>
  );
};

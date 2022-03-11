import React, { useContext } from 'react'
import styles from '../styles/ConnectButton.module.css'
import { shortenIfAddress, useEthers } from '@usedapp/core'
import { StateContext } from './context/AppState';
import ProfilePicture from './ProfilePicture';

export const ConnectButton = ({connect, disconnect}: {connect: () => void, disconnect: () => void}) => {
  const { ownProfile } = useContext(StateContext);
  const { account } = useEthers();
  const isConnected = account !== "" && account !== undefined;

  return (
    <div>
      {isConnected ? (
        <button className={styles.connectProfile} onClick={() => disconnect()}>
          <ProfilePicture profile={ownProfile}/>
          <p>{ownProfile?.name ? ownProfile.name : shortenIfAddress(account)}</p>
        </button>
      ) : (
        <button className={styles.connectProfile} onClick={() => connect()}>
          <p>Connect</p>
        </button>
      )}
    </div>
  );
};

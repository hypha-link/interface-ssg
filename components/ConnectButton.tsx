import React, { useContext } from 'react'
import styles from '../styles/connectbutton.module.css'
import { StateContext } from './context/AppState';
import ProfileImage from './ProfileImage';
import getShortAddress from '../get/getShortAddress';

export const ConnectButton = ({connect, disconnect}: {connect: () => void, disconnect: () => void}) => {
  const { ownProfile } = useContext(StateContext);
  const isConnected = ownProfile?.address !== "" && ownProfile?.address !== undefined;

  return (
    <div>
      {isConnected ? (
        <button className={styles.connectProfile} onClick={() => disconnect()}>
          <ProfileImage profile={ownProfile}/>
          <p>{ownProfile?.name ? ownProfile.name : getShortAddress(ownProfile.address)}</p>
        </button>
      ) : (
        <button className={styles.connectProfile} onClick={() => connect()}>
          <p>Connect</p>
        </button>
      )}
    </div>
  );
};

import React from 'react'
import Image from 'next/image';
import { shortenIfAddress } from '@usedapp/core'
import styles from '../styles/connectbutton.module.css'

export const ConnectButton = (props) => {
  const isConnected = props.account !== "" && props.account !== undefined;
  return (
    <div>
      {isConnected ? (
        <button className={styles.selfProfile} onClick={() => props.disconnect()}>
          <Image src={`https://robohash.org/${props.account}.png?set=set5`} alt="Me" height={"100%"} width={"100%"} />
          <p>{shortenIfAddress(props.account)}</p>
        </button>
      ) : (
        <button className={styles.selfProfile} onClick={() => props.connect()}>
          <p>Connect</p>
        </button>
      )}
    </div>
  );
};

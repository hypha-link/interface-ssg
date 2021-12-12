import React from 'react'
import { shortenIfAddress } from '@usedapp/core'

export const ConnectButton = (props) => {
  const isConnected = props.account !== "" && props.account !== undefined;
  return (
    <div>
      {isConnected ? (
        <button className="self-profile" onClick={() => props.disconnect()}>
          <img src={"https://robohash.org/" + props.account + ".png?set=set5"} alt="Me" />
          <p>{shortenIfAddress(props.account)}</p>
        </button>
      ) : (
        <button className="self-profile" onClick={() => props.connect()}>
          <p>Connect</p>
        </button>
      )}
    </div>
  );
};

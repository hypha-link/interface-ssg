import React, { useState, useEffect } from 'react'
import styles from '../styles/friend.module.css'
import Image from 'next/image'
import { shortenIfAddress, useSendTransaction } from '@usedapp/core'
import ContextMenu from './ContextMenu'
import { utils } from 'ethers'
import { BasicProfile } from '@datamodels/identity-profile-basic'

export const Friend = (props) => {
    const { profile } = props;
    const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0});
    const { sendTransaction } = useSendTransaction();

    return (
        <div 
        className = {props.selected ? `${styles.friendContainer} ${styles.selectedFriend}` : styles.friendContainer} 
        onClick={() => {
            //If not selected, allow user to select friend
            !props.selected && props.clickFriend(props.address)
        }} 
        onContextMenu={(e) => {
            setTimeout(() => setAnchorPoint({x: e.pageX, y: e.pageY}), 1);
            e.preventDefault();
        }}
        >
            <ContextMenu 
            anchorPoint={{x: anchorPoint.x, y: anchorPoint.y}} 
            localAnchorPoint={(ap) => setAnchorPoint(ap)}
            //If not selected, allow user to select friend
            select={() => !props.selected && props.clickFriend(props.address)}
            view={() => console.log(profile ? profile : "User has no profile.")}
            send={() => {
                sendTransaction({ to: props.address, value: utils.parseEther(".1")});
            }} 
            delete={() => props.deleteFriend(props.address)}
            />
            <a onClick={(e) => {console.log(profile ? profile : "User has no profile."); e.stopPropagation();}}>
                <Image src={profile && profile.hasOwnProperty('image') ? `https://ipfs.io/ipfs/${profile.image.alternatives[0].src.substring(7, profile.image.alternatives[0].src.length)}` : `https://robohash.org/${props.address}.png?set=set5`} alt="Friend" height={"100%"} width={"100%"} />
            </a>
            <p>{profile && profile.hasOwnProperty('name') ? profile.name : shortenIfAddress(props.address)}</p>
        </div>
    )
}
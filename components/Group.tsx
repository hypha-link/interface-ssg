import React, { useState } from 'react'
import styles from '../styles/friend.module.css'
import Image from 'next/image'
import { shortenIfAddress } from '@usedapp/core'
import ContextMenu from './ContextMenu'

export const Group = (props) => {
    const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0});

    return (
        <div 
        className = {props.selected ? `${styles.friendContainer} ${styles.selectedFriend}` : styles.friendContainer} 
        onClick={() => {
            //If not selected, allow user to select friend
            !props.selected && props.clickGroup(props.address)
        }} 
        onContextMenu={(e) => {
            setTimeout(() => setAnchorPoint({x: e.pageX, y: e.pageY}), 1);
            e.preventDefault();
        }}
        >
            <ContextMenu 
            anchorPoint={{x: anchorPoint.x, y: anchorPoint.y}} 
            localAnchorPoint={(ap) => setAnchorPoint(ap)}
            //If not selected, allow user to select group
            select={() => !props.selected && props.clickGroup(props.address)}
            view={() => console.log("View Profile")}
            delete={() => props.deleteGroup(props.address)}
            />
            <Image src={`https://robohash.org/${props.address}.png?set=set4`} alt="Group" height={"100%"} width={"100%"} />
            <p>{shortenIfAddress(props.address)}</p>
        </div>
    )
}

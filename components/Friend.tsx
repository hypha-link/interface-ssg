import React, { useState } from 'react'
import styles from '../styles/friend.module.css'
import Image from 'next/image'
import { shortenIfAddress, useSendTransaction } from '@usedapp/core'
import ContextMenu from './ContextMenu'
import { utils } from 'ethers'
import { Friends, Metadata } from './utilities/Types'
import ProfilePicture from './ProfilePicture'

export const Friend = (props) => {
    const { friend, metadata, inviteFriend, selectFriend, deleteFriend }: 
    {
        friend: Friends,
        metadata: Metadata,
        inviteFriend: (friend: Friends) => void,
        selectFriend: (friend: Friends) => void,
        deleteFriend: (friend: Friends) => void,
    } = props;
    const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0});
    const { sendTransaction } = useSendTransaction();

    return (
        <div 
        className = {friend.selected ? `${styles.friendContainer} ${styles.selectedFriend}` : styles.friendContainer} 
        onClick={() => {
            //If not selected, allow user to select friend
            !friend.selected && selectFriend(friend)
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
            select={() => !friend.selected && selectFriend(friend)}
            view={() => console.log(friend.profile ? friend.profile : "User has no profile.")}
            invite={() => inviteFriend(friend)}
            send={() => {
                sendTransaction({ to: friend.address, value: utils.parseEther(".1")});
            }} 
            delete={() => deleteFriend(friend)}
            />
            <ProfilePicture friend={friend} metadata={metadata} indicator={true}/>
            <p>{friend.profile?.name ? friend.profile.name : shortenIfAddress(friend.address)}</p>
        </div>
    )
}
import { useContext, useEffect, useState } from 'react';
import { StateContext } from '../components/context/AppState';
import { Friends } from '../components/utilities/Types';
import { TileDocument } from "@ceramicnetwork/stream-tile"

export const localStreamKey = "conversations";

export default function useFriendStorage() {
    const { selfId, account, friends } = useContext(StateContext);
    const [ceramicFriends, setCeramicFriends] = useState<Friends[]>(undefined);
    const [ceramicStream, setCeramicStream] = useState<TileDocument>(undefined);

    useEffect(() => {
        const friendsStore = async () => {
            const stream = await selfId.client.tileLoader.load(window.localStorage.getItem(`${account}-${localStreamKey}`));
            setCeramicFriends(stream.content.friends);
            setCeramicStream(stream);
        }
        //Update when ceramicFriends & friends are not equal (or load ceramicFriends for first time)
        const equality = ceramicFriends
          ? friends?.every((friend, i) => {
                friend.address === ceramicFriends[i]?.address &&
                friend.selected === ceramicFriends[i]?.selected &&
                friend.streamID === ceramicFriends[i]?.streamID;
            })
          : true;
        if(
            window.localStorage.getItem(`${account}-${localStreamKey}`) !== null && 
            selfId && equality
        ) friendsStore();
    }, [selfId, friends])

    return { ceramicFriends, ceramicStream };
}
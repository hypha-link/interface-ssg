import { SelfID } from '@self.id/web';
import { useEffect, useState } from 'react';
import { Friends } from '../interfaces/Types';

export default function useFriendStorage(selfId: SelfID) {
    const [friends, setFriends] = useState<Friends[]>();
    const localStreamKey = "friends-streamId";

    useEffect(() => {
        const friendsStore = async () => {
            if(window.localStorage.getItem(localStreamKey) !== null && selfId){
                const stream = await selfId.client.tileLoader.load(window.localStorage.getItem(localStreamKey));
                setFriends(stream.content.friends);
            }
        }
        friendsStore()
    }, [selfId])

    return friends;
}

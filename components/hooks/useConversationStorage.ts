import { useContext, useEffect, useState } from 'react';
import { StateContext } from '../context/AppState';
import { Conversations } from '../utils/Types';
import { TileDocument } from "@ceramicnetwork/stream-tile"

export const localStreamKey = "conversations";

export default function useConversationStorage() {
    const { selfId, ownProfile, conversations } = useContext(StateContext);
    const [ceramicConversations, setCeramicConversations] = useState<Conversations[]>(undefined);
    const [ceramicStream, setCeramicStream] = useState<TileDocument>(undefined);

    useEffect(() => {
        const conversationsStore = async () => {
            const stream = await selfId.client.tileLoader.load(window.localStorage.getItem(`${ownProfile?.address}-${localStreamKey}`));
            setCeramicConversations(stream.content.conversations);
            setCeramicStream(stream);
        }
        //Update when ceramicConversations & conversations are not equal (or load ceramicConversations for first time)
        const shouldUpdateConversations = conversations?.every((conversation, i) => {
            conversation.profile === ceramicConversations[i]?.profile &&
            conversation.selected === ceramicConversations[i]?.selected &&
            conversation.streamId === ceramicConversations[i]?.streamId &&
            conversation.type === ceramicConversations[i]?.type;
        })
        if(window.localStorage.getItem(`${ownProfile?.address}-${localStreamKey}`) !== null && selfId && shouldUpdateConversations) conversationsStore();
    }, [selfId, conversations])

    return { ceramicConversations, ceramicStream };
}
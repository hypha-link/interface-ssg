import { useContext, useEffect, useState } from 'react';
import { StateContext } from '../context/AppState';
import { Conversations } from '../utils/Types';
import { TileDocument } from "@ceramicnetwork/stream-tile"

export const localStreamKey = "conversations";

export default function useConversationStorage() {
    const { selfId, account, conversations } = useContext(StateContext);
    const [ceramicConversations, setCeramicConversations] = useState<Conversations[]>(undefined);
    const [ceramicStream, setCeramicStream] = useState<TileDocument>(undefined);

    useEffect(() => {
        const conversationsStore = async () => {
            const stream = await selfId.client.tileLoader.load(window.localStorage.getItem(`${account}-${localStreamKey}`));
            setCeramicConversations(stream.content.conversations);
            setCeramicStream(stream);
        }
        //Update when ceramicConversations & conversations are not equal (or load ceramicConversations for first time)
        const equality = ceramicConversations
          ? conversations?.every((conversation, i) => {
                conversation.address === ceramicConversations[i]?.address &&
                conversation.selected === ceramicConversations[i]?.selected &&
                conversation.streamID === ceramicConversations[i]?.streamID;
            })
          : true;
        if(
            window.localStorage.getItem(`${account}-${localStreamKey}`) !== null && 
            selfId && equality
        ) conversationsStore();
    }, [selfId, conversations])

    return { ceramicConversations, ceramicStream };
}
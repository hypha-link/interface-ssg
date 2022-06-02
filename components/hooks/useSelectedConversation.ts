import { useContext, useMemo } from 'react'
import { StateContext } from '../context/AppState';
import { ConversationType } from '../../services/Streamr_API';

export default function useSelectedConversation() {
    const { conversations } = useContext(StateContext);
    return useMemo(() => conversations.find(_conversation => _conversation.selected === true) || { profile: [{ address:'' }], streamId: '', selected: false, type: ConversationType.Hypha }, [conversations]);
}

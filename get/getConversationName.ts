import { Conversations } from "../components/utils/Types";
import { ConversationType } from "../services/Streamr_API";
import getConversationProfile from "./getConversationProfile";
import getShortAddress from "./getShortAddress";

export default function getConversationName(_conversation: Conversations) {
    if(_conversation.type === ConversationType.Hypha){
        return getConversationProfile(_conversation)?.name 
        || getConversationProfile(_conversation)?.address 
        || getShortAddress(_conversation.streamId.substring(_conversation.streamId.lastIndexOf('/') + 1))
        || 'Name Undefined'
    }
    else{
        return getConversationProfile(_conversation)?.name 
        || getConversationProfile(_conversation)?.address 
        || _conversation.streamId.substring(_conversation.streamId.lastIndexOf('/') + 1)
        || 'Name Undefined'
    }
}
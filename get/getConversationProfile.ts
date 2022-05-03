import { Conversations, Profile } from "../components/utils/Types";

export default function getConversationProfile(conversation: Conversations): Profile | undefined {
    if(conversation?.profile?.length){
        return conversation.profile[0];
    }
    else{
        return undefined;
    }
}

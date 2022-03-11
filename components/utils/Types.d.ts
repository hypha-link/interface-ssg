import { BasicProfile } from "@datamodels/identity-profile-basic";
import { ConversationType } from "../../services/Streamr_API";

export interface Conversations {
    profile: Profile[],
    streamId: string,
    selected: boolean,
    type: ConversationType,
    metadata?: Metadata,
    messages?: MessageData[],
    metadata?: Metadata[],
};

interface Profile extends BasicProfile{
    address: string,
}

export interface MessagePayload {
    sender: string,
    message: string,
    date: string;
}

export interface Metadata{
    address: string,
    typing: boolean,
    online?: boolean,
    receipt?: boolean,
}
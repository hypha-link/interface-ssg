import { BasicProfile } from "@datamodels/identity-profile-basic";

export interface Friends {
    address: string,
    streamID: string,
    selected: boolean,
    profile?: BasicProfile,
    messages?: MessageData[],
    metadata?: Metadata,
};

export interface MessageData {
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
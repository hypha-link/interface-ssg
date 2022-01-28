import { BasicProfile } from "@datamodels/identity-profile-basic";

export interface Friends {
    address: string,
    streamID: string,
    profile?: BasicProfile,
};
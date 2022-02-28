import { BasicProfile } from "@datamodels/identity-profile-basic";
import { SelfID } from "@self.id/web";
import StreamrClient from "streamr-client";
import { Friends, MessageData, Metadata } from "../utilities/Types";

export interface GlobalState{
    account: string,
    streamr: StreamrClient,
    selfId: SelfID,
    profile: BasicProfile,
    notifications: Notification[],
    friends: Friends[],
}

export type GlobalDispatch = (fn: ActionType) => void;

export enum Actions{
    CLEAR_STATE = 'CLEAR_STATE',
    SET_ACCOUNT = 'SET_ACCOUNT',
    SET_STREAMR = 'SET_STREAMR',
    SET_SELFID = 'SET_SELFID',
    SET_PROFILE = 'SET_PROFILE',
    ADD_NOTIFICATION = 'ADD_NOTIFICATION',
    SET_FRIENDS = 'SET_FRIENDS',
    ADD_FRIEND = 'ADD_FRIEND',
    DELETE_FRIEND = 'DELETE_FRIEND',
    SELECT_FRIEND = 'SELECT_FRIEND',
    INVITE_FRIEND = 'INVITE_FRIEND',
    SET_MESSAGES = 'SET_MESSAGES',
    ADD_MESSAGE = 'ADD_MESSAGE',
    DELETE_MESSAGE = 'DELETE_MESSAGE',
    SELECT_MESSAGE = 'SELECT_MESSAGE',
    SET_METADATA = 'SET_METADATA',
}

export type Action<Type, Payload> = {
    type: Type,
    payload?: Payload
}

type ClearState = Action<Actions.CLEAR_STATE, void>
type SetAccount = Action<Actions.SET_ACCOUNT, string>
type SetStreamr = Action<Actions.SET_STREAMR, StreamrClient>
type SetSelfId = Action<Actions.SET_SELFID, SelfID>
type SetProfile = Action<Actions.SET_PROFILE, BasicProfile>
type AddNotification = Action<Actions.ADD_NOTIFICATION, Notification>
type SetFriends = Action<Actions.SET_FRIENDS, Friends[]>
type AddFriend = Action<Actions.ADD_FRIEND, Friends>
type DeleteFriend = Action<Actions.DELETE_FRIEND, Friends>
type SelectFriend = Action<Actions.SELECT_FRIEND, Friends>
type InviteFriend = Action<Actions.INVITE_FRIEND, Friends>
type SetMessages = Action<Actions.SET_MESSAGES, { friend: Friends, messages: MessageData[] }>
type AddMessage = Action<Actions.ADD_MESSAGE, MessageData>
type DeleteMessage = Action<Actions.DELETE_MESSAGE, MessageData>
type SelectMessage = Action<Actions.SELECT_MESSAGE, MessageData>
type SetMetadata = Action<Actions.SET_METADATA, { friend: Friends, metadata: Metadata }>

export type ActionType = 
| ClearState
| SetAccount
| SetStreamr
| SetSelfId
| SetProfile
| AddNotification
| SetFriends
| AddFriend
| DeleteFriend
| SelectFriend
| InviteFriend
| SetMessages
| AddMessage
| DeleteMessage
| SelectMessage
| SetMetadata
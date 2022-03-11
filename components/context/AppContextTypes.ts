import { SelfID } from "@self.id/web";
import StreamrClient from "streamr-client";
import { Conversations, MessagePayload, Metadata, Profile } from "../utils/Types";

export interface GlobalState{
    streamr: StreamrClient,
    selfId: SelfID,
    ownProfile: Profile,
    notifications: Notification[],
    conversations: Conversations[],
    selectedConversation: Conversations
}

export type GlobalDispatch = (fn: ActionType) => void;

export enum Actions{
    CLEAR_STATE = 'CLEAR_STATE',
    SET_ACCOUNT = 'SET_ACCOUNT',
    SET_STREAMR = 'SET_STREAMR',
    SET_SELFID = 'SET_SELFID',
    SET_PROFILE = 'SET_PROFILE',
    ADD_NOTIFICATION = 'ADD_NOTIFICATION',
    SET_CONVERSATIONS = 'SET_CONVERSATIONS',
    ADD_CONVERSATION = 'ADD_CONVERSATION',
    DELETE_CONVERSATION = 'DELETE_CONVERSATION',
    SELECT_CONVERSATION = 'SELECT_CONVERSATION',
    INVITE_CONVERSATION = 'INVITE_CONVERSATION',
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
type SetProfile = Action<Actions.SET_PROFILE, Profile>
type AddNotification = Action<Actions.ADD_NOTIFICATION, Notification>
type SetConversations = Action<Actions.SET_CONVERSATIONS, Conversations[]>
type AddConversation = Action<Actions.ADD_CONVERSATION, Conversations>
type DeleteConversation = Action<Actions.DELETE_CONVERSATION, Conversations>
type SelectConversation = Action<Actions.SELECT_CONVERSATION, Conversations>
type InviteConversation = Action<Actions.INVITE_CONVERSATION, Conversations>
type SetMessages = Action<Actions.SET_MESSAGES, { conversation: Conversations, messages: MessagePayload[] }>
type AddMessage = Action<Actions.ADD_MESSAGE, MessagePayload>
type DeleteMessage = Action<Actions.DELETE_MESSAGE, MessagePayload>
type SelectMessage = Action<Actions.SELECT_MESSAGE, MessagePayload>
type SetMetadata = Action<Actions.SET_METADATA, { conversation: Conversations, metadata: Metadata }>

export type ActionType = 
| ClearState
| SetAccount
| SetStreamr
| SetSelfId
| SetProfile
| AddNotification
| SetConversations
| AddConversation
| DeleteConversation
| SelectConversation
| InviteConversation
| SetMessages
| AddMessage
| DeleteMessage
| SelectMessage
| SetMetadata
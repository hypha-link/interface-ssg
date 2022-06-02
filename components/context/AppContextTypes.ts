import { SelfID } from "@self.id/web";
import { providers, Wallet } from "ethers";
import { IPFS } from "ipfs-core"
import StreamrClient from "streamr-client";
import { Conversations, MessagePayload, Metadata, Profile } from "../utils/Types";

export interface GlobalState{
    web3Provider: providers.Web3Provider
    streamr: StreamrClient,
    streamrDelegate: { client: StreamrClient, wallet: Wallet }
    selfId: SelfID,
    ipfs: IPFS,
    ownProfile: Profile,
    notifications: Notification[],
    conversations: Conversations[],
}

export type GlobalDispatch = (fn: ActionType) => void;

export enum Actions{
    CLEAR_STATE = 'CLEAR_STATE',
    SET_WEB3_PROVIDER = 'SET_PROVIDER',
    SET_ACCOUNT = 'SET_ACCOUNT',
    SET_STREAMR = 'SET_STREAMR',
    SET_SELFID = 'SET_SELFID',
    SET_IPFS = 'SET_IPFS',
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
type SetWeb3Provider = Action<Actions.SET_WEB3_PROVIDER, providers.Web3Provider>
type SetAccount = Action<Actions.SET_ACCOUNT, string>
type SetStreamr = Action<Actions.SET_STREAMR, Wallet>
type SetSelfId = Action<Actions.SET_SELFID, SelfID>
type SetIpfs = Action<Actions.SET_IPFS, IPFS>
type SetProfile = Action<Actions.SET_PROFILE, Profile>
type AddNotification = Action<Actions.ADD_NOTIFICATION, Notification>
type SetConversations = Action<Actions.SET_CONVERSATIONS, Conversations[]>
type AddConversation = Action<Actions.ADD_CONVERSATION, Conversations>
type DeleteConversation = Action<Actions.DELETE_CONVERSATION, Conversations>
type SelectConversation = Action<Actions.SELECT_CONVERSATION, Conversations>
type InviteConversation = Action<Actions.INVITE_CONVERSATION, Conversations>
type SetMessages = Action<Actions.SET_MESSAGES, { conversation: Conversations, messages: MessagePayload[] }>
type AddMessage = Action<Actions.ADD_MESSAGE, { conversation: Conversations, message: MessagePayload }>
type DeleteMessage = Action<Actions.DELETE_MESSAGE, { conversation: Conversations, message: MessagePayload }>
type SelectMessage = Action<Actions.SELECT_MESSAGE, { conversation: Conversations, message: MessagePayload }>
type SetMetadata = Action<Actions.SET_METADATA, { conversation: Conversations, metadata: Metadata }>

export type ActionType = 
| ClearState
| SetWeb3Provider
| SetAccount
| SetStreamr
| SetSelfId
| SetIpfs
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
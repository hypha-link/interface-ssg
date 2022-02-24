import { SelfID } from "@self.id/web";
import StreamrClient from "streamr-client";
import { Friends, MessageData } from "../utilities/Types";

export interface GlobalState{
    streamr: StreamrClient,
    selfId: SelfID,
    account: string,
    friends: Friends[],
}

export type GlobalDispatch = (fn: ActionType) => void;

export enum Actions{
    CONNECT = 'CONNECT',
    DISCONNECT = 'DISCONNECT',
    LOAD = 'LOAD',
    ADD_FRIEND = 'ADD_FRIEND',
    DELETE_FRIEND = 'DELETE_FRIEND',
    SELECT_FRIEND = 'SELECT_FRIEND',
    INVITE_FRIEND = 'INVITE_FRIEND',
    ADD_MESSAGE = 'ADD_MESSAGE',
    DELETE_MESSAGE = 'DELETE_MESSAGE',
    SELECT_MESSAGE = 'SELECT_MESSAGE',
}

export type Action<Type, Payload> = {
    type: Type,
    payload: Payload
}

type Connect = Action<Actions.CONNECT, string>
type Disconnect = Action<Actions.DISCONNECT, string>
type Load = Action<Actions.LOAD, string>
type AddFriend = Action<Actions.ADD_FRIEND, Friends>
type DeleteFriend = Action<Actions.DELETE_FRIEND, Friends>
type SelectFriend = Action<Actions.SELECT_FRIEND, Friends>
type InviteFriend = Action<Actions.INVITE_FRIEND, Friends>
type AddMessage = Action<Actions.ADD_MESSAGE, MessageData>
type DeleteMessage = Action<Actions.DELETE_MESSAGE, MessageData>
type SelectMessage = Action<Actions.SELECT_MESSAGE, MessageData>

export type ActionType = 
| Connect
| Disconnect
| Load
| AddFriend
| DeleteFriend
| SelectFriend
| InviteFriend
| AddMessage
| DeleteMessage
| SelectMessage
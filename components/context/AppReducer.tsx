import { Actions, ActionType, GlobalState, } from './AppContextTypes'

export default function AppReducer(state: GlobalState, action: ActionType): GlobalState{
    switch(action.type){
        case Actions.CONNECT:
            return {
                ...state,
                account: ''
            };
        case Actions.DISCONNECT:
            return {
                ...state,
                account: ''
            };
        case Actions.LOAD:
            return {
                ...state,
                account: ''
            };
        case Actions.ADD_FRIEND:
            return {
                ...state,
                friends: [...state.friends, action.payload]
            };
        case Actions.DELETE_FRIEND:
            return {
                ...state,
                account: ''
            };
        case Actions.SELECT_FRIEND:
            return {
                ...state,
                account: ''
            };
        case Actions.INVITE_FRIEND:
            return {
                ...state,
                account: ''
            };
        case Actions.ADD_MESSAGE:
            return {
                ...state,
                account: ''
            };
        case Actions.DELETE_MESSAGE:
            return {
                ...state,
                account: ''
            };
        case Actions.SELECT_MESSAGE:
            return {
                ...state,
                account: ''
            };
    }
}
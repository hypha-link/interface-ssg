import { Conversations } from '../utils/Types';
import { Actions, ActionType, GlobalState, } from './AppContextTypes'
import { initialState } from './AppState';

export default function AppReducer(state: GlobalState, action: ActionType): GlobalState{
    switch(action.type){
        case Actions.CLEAR_STATE:
            return {...initialState};
        case Actions.SET_ACCOUNT:
            return {
                ...state,
                account: action.payload
            }
        // Not used
        case Actions.SET_STREAMR:
            return {
                ...state,
                streamr: action.payload
            };
        case Actions.SET_SELFID:
            return {
                ...state,
                selfId: action.payload
            };
        case Actions.SET_PROFILE:
            return {
                ...state,
                profile: action.payload
            };
        case Actions.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };
        case Actions.SET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload
            };
        case Actions.ADD_CONVERSATION:
            return {
                ...state,
                conversations: [
                    ...state.conversations, 
                    action.payload
                ]
            }
        case Actions.DELETE_CONVERSATION:
            return {
                ...state,
                conversations: state.conversations.filter(conversation => conversation !== action.payload)
            };
        case Actions.SELECT_CONVERSATION:
            return {
                ...state,
                conversations:
                state.conversations.map(conversation => {
                    if(conversation.address === action.payload.address) {
                        console.log(conversation.address);
                        
                        conversation.selected = true;
                    }
                    else{
                        console.log(action.payload.address);
                        
                        conversation.selected = false;
                    }
                    return conversation;
                })
            };
        // Not used
        case Actions.INVITE_CONVERSATION:
            return {
                ...state,
                conversations: [...state.conversations]
            };
        case Actions.SET_MESSAGES:
            const newConversation = action.payload.conversation;
            newConversation.messages = [...newConversation.messages, ...action.payload.messages];
            return {
                ...state,
                conversations: [
                    ...state.conversations,
                    newConversation
                ]
            }
        // Not used
        case Actions.ADD_MESSAGE:
            return {...state};
        // Not used
        case Actions.DELETE_MESSAGE:
            return {...state};
        // Not used
        case Actions.SELECT_MESSAGE:
            return {...state};
        // Not used
        case Actions.SET_METADATA:
            const newConversation2 = action.payload.conversation;
            newConversation2.metadata = action.payload.metadata
            return {
                ...state,
                conversations: [
                    ...state.conversations,
                    newConversation2
                ]
            }
    }
}
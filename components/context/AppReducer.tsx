import { Friends } from '../utilities/Types';
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
        case Actions.SET_FRIENDS:
            return {
                ...state,
                friends: action.payload
            };
        case Actions.ADD_FRIEND:
            return {
                ...state,
                friends: [
                    ...state.friends, 
                    action.payload
                ]
            }
        case Actions.DELETE_FRIEND:
            return {
                ...state,
                friends: state.friends.filter(friend => friend !== action.payload)
            };
        case Actions.SELECT_FRIEND:
            return {
                ...state,
                friends:
                state.friends.map(friend => {
                    if(friend.address === action.payload.address) {
                        console.log(friend.address);
                        
                        friend.selected = true;
                    }
                    else{
                        console.log(action.payload.address);
                        
                        friend.selected = false;
                    }
                    return friend;
                })
            };
        // Not used
        case Actions.INVITE_FRIEND:
            return {
                ...state,
                friends: [...state.friends]
            };
        case Actions.SET_MESSAGES:
            const newFriend = action.payload.friend;
            newFriend.messages = [...newFriend.messages, ...action.payload.messages];
            return {
                ...state,
                friends: [
                    ...state.friends,
                    newFriend
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
            const newFriend2 = action.payload.friend;
            newFriend2.metadata = action.payload.metadata
            return {
                ...state,
                friends: [
                    ...state.friends,
                    newFriend2
                ]
            }
    }
}
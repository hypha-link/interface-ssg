import React, { useReducer, createContext } from 'react'
import { ConversationType } from '../../services/Streamr_API';
import { GlobalDispatch, GlobalState } from './AppContextTypes';
import AppReducer from './AppReducer';

export const initialState: GlobalState = {
    web3Provider: undefined,
    streamr: undefined,
    streamrDelegate: undefined,
    selfId: undefined,
    ipfs: undefined,
    ownProfile: undefined,
    notifications: [],
    conversations: [],
}

export const StateContext = createContext<GlobalState>(initialState);
export const DispatchContext = createContext<GlobalDispatch>(() => {});

export default function AppState(props){
    const [state, dispatch] = useReducer(AppReducer, initialState);
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {props.children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}
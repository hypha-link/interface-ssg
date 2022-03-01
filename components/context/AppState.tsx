import React, { useReducer, createContext } from 'react'
import { GlobalDispatch, GlobalState } from './AppContextTypes';
import AppReducer from './AppReducer';

export const initialState: GlobalState = {
    account: undefined,
    streamr: undefined,
    selfId: undefined,
    profile: undefined,
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
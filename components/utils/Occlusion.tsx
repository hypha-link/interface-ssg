import React, { createContext, useContext, useState } from 'react'
import { ReactElement } from 'react-markdown/lib/react-markdown';

export const OcclusionContext = createContext<ReactElement>(null)
export const OcclusionUpdateContext = createContext<React.Dispatch<ReactElement>>(() => null)

export function OcclusionState({ children } : { children: React.ReactNode }){
    const [occlusionState, setOcclusionState] = useState<ReactElement>(null)
    return(
        <OcclusionContext.Provider value={occlusionState}>
            <OcclusionUpdateContext.Provider value={setOcclusionState}>
                {children}
            </OcclusionUpdateContext.Provider>
        </OcclusionContext.Provider>
    )
}

//Reminder: Set stopPropagation() on children

export default function Occlusion({ children } : { children: React.ReactNode }) {
    const setOcclusionState = useContext(OcclusionUpdateContext);
    return (
        <div
            style={{
                position: 'relative'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    backgroundColor: 'rgba(0, 0, 0, .8)',
                    zIndex: 1,
                    width: '100vw',
                    height: '100vh',
                    transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setOcclusionState(null)}
            >
                {children}
            </div>
        </div>
    )
}
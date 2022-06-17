import React, { useEffect, useState } from 'react'
import styles from '../styles/messagecontext.module.css'
import useSelectedConversation from "./hooks/useSelectedConversation";
import emoji from 'node-emoji';

type MessageContextProps = {
    show: string
    value: (value: string) => void
    cancel: () => void
}

enum ContextType {
    Emoji,
    User,
    Command,
}

export const MessageContext = ({ show, value, cancel } : MessageContextProps ) => {
    const selectedConversation = useSelectedConversation();
    const [context, setContext] = useState<ContextType>(undefined);

    const users = selectedConversation.profile.filter((profile) => profile.address.includes(show.substring(1, show.length)));

    useEffect(() => {
        //Display if user is trying to type an emoji
        if(show.length >= 3 && show.startsWith(':')){
            setContext(ContextType.Emoji);
        }
        //Display if user is trying to @ someone
        else if(show.startsWith('@')){
            //Check if any users match query
            if(users.length > 0){
                setContext(ContextType.User);
            }
        }
        //Display if user is trying to use a built in command
        else if(show.startsWith('/')){
            setContext(ContextType.Command);
        }
        //Show nothing
        else{
            setContext(undefined);
        }
    }, [show])
    
    const selectedContext = () => {
        switch(context){
            case ContextType.Emoji:
                return (
                    <div>
                        {emoji.search(show).map((item) => {
                            return(
                                <button 
                                    key={Math.random()}
                                    onClick={() => {
                                        value(item.emoji);
                                        cancel();
                                    }}
                                >
                                {item.emoji}
                                </button>
                            )
                        })}
                    </div>
                );
            case ContextType.User:
                return (
                    <div>
                        {users.map((user) => {
                            return(
                                <button
                                    key={Math.random()}
                                    onClick={() => {
                                        value(user.address);
                                        cancel();
                                    }}
                                >
                                {(user?.name || user.address).replaceAll(' ', '')}
                                </button>
                            )
                        })}
                    </div>
                );
            case ContextType.Command:
                return (
                    <div>
                        <button 
                            onClick={() => {
                                value("Example-Command");
                                cancel();
                            }}
                        >
                        Command 1
                        </button>
                    </div>
                );
        }
    }

    return (
        context !== undefined ?
        <section 
            className="overlay" 
            id={styles.messageContext} 
            onBlur={() => cancel()}
        >
            {selectedContext()}
        </section>
        :
        <></>
    )
}

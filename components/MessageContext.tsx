import React, { useEffect, useState } from 'react'
import styles from '../styles/messagecontext.module.css'
import useSelectedConversation from "./hooks/useSelectedConversation";
import emoji from 'node-emoji';
import { TokenFeed } from './TokenFeed';
import usePriceData from './hooks/usePriceData';
import LoadingIcons from 'react-loading-icons';

type MessageContextProps = {
    show: string
    value: (value: string) => void
    cancel: () => void
}

enum ContextType {
    Emoji,
    User,
    Command,
    PriceFeed,
}

export const MessageContext = ({ show, value, cancel } : MessageContextProps ) => {
    const selectedConversation = useSelectedConversation();
    const [context, setContext] = useState<ContextType>(undefined);
    const priceData = usePriceData({ update: show.length > 0, updateFrequency: 10000 });

    const users = selectedConversation.profile.filter((profile) => profile.address.includes(show.substring(1, show.length)));
    const showSymbol = show.toUpperCase().substring(1, show.indexOf(',') !== -1 ? show.indexOf(',') : show.length);

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
        //Display if user is trying to create a price feed
        else if(show.startsWith('[')){
            setContext(ContextType.PriceFeed)
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
                    <>
                        <p>EMOJI MATCHING {show}</p>
                        <div id={styles.emoji}>
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
                    </>
                );
            case ContextType.User:
                return (
                    <>
                        <p>USERS</p>
                        <div id={styles.user}>
                            {users.map((user) => {
                                return(
                                    <button
                                        key={Math.random()}
                                        onClick={() => {
                                            value(user.address);
                                            cancel();
                                        }}
                                    >
                                    {`@${(user?.name || user.address).replaceAll(' ', '')}`}
                                    </button>
                                )
                            })}
                        </div>
                    </>
                );
            case ContextType.Command:
                return (
                    <>
                        <p>COMMANDS</p>
                        <div id={styles.command}>
                            <button 
                                onClick={() => {
                                    value("Example-Command");
                                    cancel();
                                }}
                            >
                            Command 1
                            </button>
                        </div>
                    </>
                );
            case ContextType.PriceFeed:
                return (
                    <>
                        <p>PRICE FEEDS MATCHING {show}</p>
                        <div id={styles.priceFeed}>
                            {
                                priceData.length !== 0 ?
                                priceData.filter(item => item.symbol.includes(showSymbol)).splice(0, 12).map((feed) => {
                                    return(
                                        <TokenFeed 
                                            key={feed.symbol} 
                                            tokenName={feed.symbol} 
                                            tokenPrice={feed.value} 
                                            onClick={() => {
                                                value(`${feed.symbol},${feed.value}]`);
                                                cancel();
                                            }} 
                                            hideLiveFeedCheckbox={true}/>
                                    )
                                })
                                :
                                <LoadingIcons.Puff style={{ minWidth: '100px', minHeight: '100px' }} stroke="var(--appColor)" speed={2}/>
                            }
                        </div>
                    </>
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
            <div id={styles.selectedContext}>
                {selectedContext()}
            </div>
        </section>
        :
        <></>
    )
}

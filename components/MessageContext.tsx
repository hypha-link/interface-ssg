import React, { ReactElement, useEffect, useState } from 'react'
import styles from '../styles/messagecontext.module.css'
import useSelectedConversation from "./hooks/useSelectedConversation";
import emoji from 'node-emoji';
import { TokenFeed } from './TokenFeed';
import { useAllPriceData } from './hooks/usePriceData';
import LoadingIcons from 'react-loading-icons';

type MessageContextProps = {
    inputValue: string
    onClick: (value: string) => void
    cancel: () => void
}

enum ContextType {
    Emoji,
    User,
    Command,
    PriceFeed,
}

export const MessageContext = ({ inputValue, onClick, cancel } : MessageContextProps ) => {
    const selectedConversation = useSelectedConversation();
    const [context, setContext] = useState<ContextType>(undefined);
    const priceData = useAllPriceData(inputValue.startsWith('['), 30000);

    // Emojis
    const emojis = emoji.search(inputValue);
    // Users
    const users = selectedConversation.profile.filter(user => (user?.name || user.address).includes(inputValue.substring(1, inputValue.length)));
    // PriceFeeds
    const showSymbol = inputValue.toUpperCase().substring(1, inputValue.indexOf(',') !== -1 ? inputValue.indexOf(',') : inputValue.length);
    const prices = priceData.filter(item => item.symbol.includes(showSymbol));

    useEffect(() => {
        //Display if user is trying to type an emoji
        if(inputValue.length >= 3 && inputValue.startsWith(':')){
            //Check if any emojis match query
            if(emojis.length > 0){
                setContext(ContextType.Emoji);
            }
        }
        //Display if user is trying to @ someone
        else if(inputValue.startsWith('@')){
            //Check if any users match query
            if(users.length > 0){
                setContext(ContextType.User);
            }
        }
        //Display if user is trying to use a built in command
        else if(inputValue.startsWith('/')){
            setContext(ContextType.Command);
        }
        //Display if user is trying to create a price feed
        else if(inputValue.startsWith('[')){
            //Check if any price feeds match query
            if(prices.length > 0){
                setContext(ContextType.PriceFeed);
            }
        }
        //Show nothing
        else{
            setContext(undefined);
        }
    }, [inputValue, emojis.length, users.length, prices.length])
    
    const selectedContext = () => {
        switch(context){
            case ContextType.Emoji:
                return (
                    <>
                        <InfoBar 
                            title={
                                <span>
                                    EMOJI MATCHING 
                                    <span>
                                        {inputValue}
                                    </span>
                                </span>
                            }
                            results={
                                <span>
                                    Results: 
                                    <span>
                                        {emojis.length}
                                    </span>
                                </span>
                            }
                        />
                        <div id={styles.emoji}>
                            {emojis.splice(0, 18).map((item) => {
                                return(
                                    <button 
                                        key={item.emoji}
                                        onClick={() => {
                                            onClick(item.emoji);
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
                        <InfoBar 
                            title={
                                <span>
                                    USERS MATCHING
                                    <span>
                                        {inputValue}
                                    </span>
                                </span>
                            }
                            results={
                                <span>
                                    Results:
                                    <span>
                                        {users.length}
                                    </span>
                                </span>
                            }
                        />
                        <div id={styles.user}>
                            {users.map((user) => {
                                return(
                                    <button
                                        key={Math.random()}
                                        onClick={() => {
                                            onClick(user.address);
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
                        <InfoBar title={<span>COMMANDS</span>}/>
                        <div id={styles.command}>
                            <button 
                                onClick={() => {
                                    onClick("Example-Command");
                                    cancel();
                                }}
                            >
                                Example-Command  
                            </button>
                        </div>
                    </>
                );
            case ContextType.PriceFeed:
                return (
                    <>
                        <InfoBar 
                            title={
                                <span>
                                    PRICE FEEDS MATCHING 
                                    <span>
                                        {inputValue.toUpperCase()}
                                    </span>
                                </span>
                            } 
                            results={
                                <span>
                                    Results:
                                    <span>
                                        {prices.length}
                                    </span>
                                </span>
                            }
                        />
                        <div id={styles.priceFeed}>
                            {
                                priceData.length !== 0 ?
                                prices.splice(0, 12).map((feed) => {
                                    return(
                                        <TokenFeed 
                                            key={feed.symbol} 
                                            tokenName={feed.symbol} 
                                            tokenPrice={feed.value} 
                                            onClick={() => {
                                                onClick(`${feed.symbol},${feed.value}]`);
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

function InfoBar({ title, results } : { title: ReactElement, results?: ReactElement }) {
  return (
    <div className={styles.infoBar}>
        <p id={styles.title}>{title}</p>
        <p id={styles.results}>{results}</p>
    </div>
  )
}

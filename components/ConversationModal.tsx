import { utils } from 'ethers';
import React, {useContext, useState} from 'react'
import styles from '../styles/conversationmodal.module.css'
import { StateContext } from './context/AppState';

export const ConversationModal = ({show, addConversation, cancel}: { show: boolean, addConversation: (inputValue: string) => void, cancel: () => void}) => {
    const [inputValue, setInputValue] = useState('');
    const [placeholderText, setPlaceholderText] = useState('Enter an Ethereum address');
    const {ownProfile} = useContext(StateContext);

    const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmission();
        }
    };

    const handleSubmission = () => {
        if(utils.isAddress(inputValue) && inputValue !== ownProfile.address){
            addConversation(inputValue);
        }
        else if(inputValue === ''){
            setPlaceholderText('Enter an Ethereum address');
            setInputValue('');
        }
        else if(inputValue === ownProfile.address){
            setPlaceholderText('Please enter the address of another user');
            setInputValue('');
        }
        else{
            setPlaceholderText(`${inputValue} is not an Ethereum address`);
            setInputValue('');
        }
    }

    return (
        show ?
        <div id={styles.conversationModal}>
            <p>Add conversation?</p>
            <input
            type="text"
            placeholder={placeholderText}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => keyHandler(e)}
            >
            </input>
            <div>
                <button
                className="hypha-button"
                onClick={() => {
                    handleSubmission();
                }}
                >
                Add Conversation
                </button>
                <button
                className="hypha-button"
                onClick={() => {
                    cancel();
                    setInputValue('');
                }}
                >
                Close
                </button>
            </div>
        </div>
        :
        null
    )
}

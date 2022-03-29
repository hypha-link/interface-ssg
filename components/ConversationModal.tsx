import React, {useState} from 'react'
import styles from '../styles/conversationmodal.module.css'

export const ConversationModal = ({show, addConversation, cancel}: { show: boolean, addConversation: (inputValue: string) => void, cancel: () => void}) => {
    const [inputValue, setInputValue] = useState("");

    const keyHandler = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            addConversation(inputValue);
        }
      };

    return (
        show ?
        <div id={styles.conversationModal}>
            <p>Add conversation?</p>
            <input
            type="text"
            placeholder="Enter an Ethereum address"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => keyHandler(e)}
            >
            </input>
            <div>
                <button
                className="hypha-button"
                onClick={() => {
                    addConversation(inputValue);
                    setInputValue("");
                }}
                >
                Add Conversation
                </button>
                <button
                className="hypha-button"
                onClick={() => {
                    cancel();
                    setInputValue("");
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

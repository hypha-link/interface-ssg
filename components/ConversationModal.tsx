import React, {useState} from 'react'
import styles from '../styles/ConversationModal.module.css'

export const ConversationModal = (props) => {
    const [inputValue, setInputValue] = useState("");

    const keyHandler = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            props.addConversation(inputValue);
        }
      };

    return (
        props.show ?
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
                    props.addConversation(inputValue);
                    setInputValue("");
                }}
                >
                Add Conversation
                </button>
                <button
                className="hypha-button"
                onClick={() => {
                    props.cancel();
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

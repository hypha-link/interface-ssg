import React, {useState} from 'react'
import styles from '../styles/FriendModal.module.css'

export const FriendModal = (props) => {
    const [inputValue, setInputValue] = useState("");

    const keyHandler = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            props.addFriend(inputValue);
        }
      };

    return (
        props.show ?
        <div id={styles.friendModal}>
            <p>Add a friend?</p>
            <input
            type="text"
            placeholder="Friend's Address"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => keyHandler(e)}
            >
            </input>
            <div>
                <button
                className="hypha-button"
                onClick={() => {
                    props.addFriend(inputValue);
                    setInputValue("");
                }}
                >
                Add Friend
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

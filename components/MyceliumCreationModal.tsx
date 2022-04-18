import React, {useState} from 'react'
import styles from '../styles/myceliumcreationmodal.module.css'

export const MyceliumCreationModal = ({show, create, cancel}: { show: boolean, create: (inputValue: string) => void, cancel: () => void}) => {
    const [inputValue, setInputValue] = useState("");
    const [placeholderText, setPlaceholderText] = useState('Enter a name');

    const keyHandler = (e) => {
        if (e.key === "Enter") {
            handleSubmission();
        }
    };

    const handleSubmission = () => {
        if(inputValue.trim() === ''){
            setPlaceholderText('Enter a name');
            setInputValue('');
        }
        else if(inputValue.length < 3){
            setPlaceholderText('Please make sure the name is 3 characters or longer');
            setInputValue('');
        }
        else{
            create(inputValue);
            cancel();
        }
    }

    return (
        show ?
        <div id={styles.modal}>
            <p>Create Mycelium</p>
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
                    if(inputValue.trim() !== ''){
                        handleSubmission();
                    }
                }}
                >
                Create
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

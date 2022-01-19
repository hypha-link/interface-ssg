import React, { useState } from 'react'
import styles from "../styles/edit.module.css"

export const Edit = (props) => {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const keyHandler = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            selectedType(inputValue);
            setEditing(false);
            setInputValue("");
        }
      };
    
    const buttonHandler = (e) => {
        if (inputValue.trim() !== ""){
            selectedType(inputValue);
            setEditing(false);
            setInputValue("");
        }
    };

    const selectedType = (newChange) => {
        switch(props.type){
            case 'name':
                changeName(newChange);
                break;
            case 'description':
                changeDescription(newChange);
                break;
        }
    }

    const changeName = async (newName) => {
        console.log("Set Profile Name");
        await props.profile.merge('basicProfile', {
            name: newName
        });
    }

    const changeDescription = async (newDescription) => {
        console.log("Set Profile Description");
        await props.profile.merge('basicProfile', {
            description: newDescription
        });
    }

    return (
        <div className={styles.edit}>
            <a className={editing ? styles.hidden : ''} onClick={() => setEditing(!editing)}>Edit</a>
            <div className={!editing ? styles.hidden : ''}>
                <input
                name="edit"
                type="text"
                placeholder={props.type}
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => keyHandler(e)}
                ></input>
                <a
                onClick={(e) => buttonHandler(e)}
                >Set</a>
                <a onClick={() => setEditing(!editing)}>X</a>
            </div>
        </div>
    )
}

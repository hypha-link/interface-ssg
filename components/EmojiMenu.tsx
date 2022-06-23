import React from 'react'
import styles from '../styles/emojimenu.module.css'
import emojis from 'emojis-list';

type EmojiMenuProps = {
    show: boolean
    onClick: (value: string) => void
    cancel: () => void
}

export const EmojiMenu = ({ show, onClick, cancel } : EmojiMenuProps) => {
    const emojiArr = [];
    for(let i = 1749; i < 1817; i++){
        emojiArr.push(emojis[i]);
    }
    for(let i = 2136; i < 2143; i++){
        emojiArr.push(emojis[i]);
    }
    for(let i = 2187; i < 2192; i++){
        emojiArr.push(emojis[i]);
    }
    for(let i = 2211; i < 2219; i++){
        emojiArr.push(emojis[i]);
    }
    for(let i = 2416; i < 2422; i++){
        emojiArr.push(emojis[i]);
    }
    emojiArr.push(emojis[2601]);
    emojiArr.push(emojis[2910]);
    return (
        show ?
        <section className="overlay" id={styles.emojiMenu} onBlur={() => cancel()}>
            {emojiArr.map((emoji) => {
                return(
                    <button 
                        key={emoji} 
                        onClick={() => {
                            onClick(emoji);
                            cancel();
                        }}
                    >
                    {emoji}
                    </button>
                )
            })}
        </section>
        :
        <></>
    )
}

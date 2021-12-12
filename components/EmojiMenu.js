import React from 'react'
const emojis = require('emojis-list')

export const EmojiMenu = (props) => {
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
        <section className="overlay" id="emoji-menu" onBlur={(e) => props.onBlur(e)}>
            {emojiArr.map((emoji) => {
                return(
                    <button key={emoji} onClick={() => props.value(emoji)}>{emoji}</button>
                )
            })}
        </section>
    )
}

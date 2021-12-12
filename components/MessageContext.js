import React from 'react'

export const MessageContext = (props) => {
    return (
        <section className="overlay" id="msg-context" onBlur={(e) => props.onBlur(e)}>
            <div>
                <button onClick={() => props.value("😃")}>&#x1F603;</button>
                <button onClick={() => props.value("👋")}>&#x1F44B;</button>
                <button onClick={() => props.value("🤣")}>&#x1F923;</button>
                <button onClick={() => props.value("🤗")}>&#x1F917;</button>
                <button onClick={() => props.value("🤠")}>&#x1F920;</button>
            </div>
        </section>
    )
}

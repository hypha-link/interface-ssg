import React from 'react'
import styles from '../../styles/typing.module.css'
import { Metadata } from './Types';

export default function Typing(props) {
    const { metadata }: 
    {
        metadata: Metadata,
    } = props;
  return (
    <span className={`dot ${styles.background} ${metadata.online ? styles.online : ''} ${metadata.typing ? styles.typing : ''}`}>
        <div className={`${styles.typingContainer} ${metadata.typing ? '' : styles.typingHidden}`}>
            <span className='dot'/>
            <span className='dot'/>
            <span className='dot'/>
        </div>
    </span>
  )
}

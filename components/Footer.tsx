import styles from '../styles/footer.module.css'
import React from 'react'
import FA, { FATypes } from './svg/FA'

export default function Footer() {
  return (
    <footer className={styles.footer}>
        <ul>
            <li><a href='https://gitlab.com/hypha-link' target='_blank' rel="noreferrer"><FA FAType={FATypes.Gitlab}/></a></li>
            <li><a href='https://twitter.com/hyphalink' target='_blank' rel="noreferrer"><FA FAType={FATypes.Twitter}/></a></li>
            <li><a href='https://www.youtube.com/channel/UC2lOBy3z83CXh0Ww66qdPOw' target='_blank' rel="noreferrer"><FA FAType={FATypes.Youtube}/></a></li>
            {/* <li><a href='https://medium.com/@hypha' target='_blank' rel="noreferrer">Medium</a></li> */}
            {/* <li><a>Hypha Discussion Server (Future)</a></li> */}
        </ul>
        {/* <ul>
            <li><a href='#Privacy'>Privacy Policy</a></li>
            <li><a href='#Terms'>Terms of Use</a></li>
        </ul> */}
        <ul>
            {/* <li><a href='#FAQ'>FAQ</a></li> */}
            <li><a href='mailto:connect@hypha.link'>Connect</a></li>
        </ul>
    </footer>
  )
}

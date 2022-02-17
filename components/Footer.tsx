import styles from '../styles/footer.module.css'
import React from 'react'
import Gitlab from "../public/fa/gitlab.svg"
import Twitter from "../public/fa/twitter.svg"
import Youtube from "../public/fa/youtube.svg"

export default function Footer() {
  return (
    <footer className={styles.footer}>
        <ul>
            <li><a href='https://gitlab.com/hypha-link' target='_blank' rel="noreferrer"><Gitlab/></a></li>
            <li><a href='https://twitter.com/hyphalink' target='_blank' rel="noreferrer"><Twitter/></a></li>
            <li><a href='https://www.youtube.com/channel/UC2lOBy3z83CXh0Ww66qdPOw' target='_blank' rel="noreferrer"><Youtube/></a></li>
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

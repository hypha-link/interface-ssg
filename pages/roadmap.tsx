import styles from '../styles/roadmap.module.css'
import React from 'react'
import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'

const roadmap = () => {
  return (
    <>
        <NavigationBar/>
        <section id={styles.title}>
            <div>
                <h1>Roadmap</h1>
                <p>
                    Follow along Hypha&apos;s development with this handy roadmap! View our current progress, or the planned direction of the project below.
                </p>
            </div>
        </section>
        <section id={styles.roadmap}>
            {/* Chime */}
            <div>
                <div className={styles.milestone}>
                    <h1>Chime</h1>
                    <h3>Fall 2021</h3>
                </div>
                <div className={styles.circle}/>
                <ul className={styles.checked}>
                    <li>1 to 1 Ethereum Messaging</li>
                    <li>Basic Conversation Storage</li>
                    <li>Price Feeds</li>
                    <li>Emojis</li>
                    <li>IPFS Integration</li>
                </ul>
            </div>
            {/* Rebranding */}
            <div>
                <div className={styles.milestone}>
                    <h1>Rebranding</h1>
                    <h3>December 2021</h3>
                </div>
                <div className={styles.circle}/>
                <ul className={styles.checked}>
                    <li>Front Page</li>
                    <li>Notifications</li>
                    <li>Basic Encryption</li>
                    <li>Preparation for Ceramic (NextJS)</li>
                    <li>Local Storage Replacement (Cermaic)</li>
                    <li>Custom Context Menu</li>
                    <li>Rebrand to Hypha</li>
                </ul>
            </div>
            {/* Hyphae */}
            <div>
                <div className={styles.milestone}>
                    <h1>Hyphae</h1>
                    <h3>January 2022</h3>
                </div>
                <div className={styles.circle}/>
                <ul className={styles.checked}>
                    <li>Hyphae (Group Messaging)</li>
                    <li>Message Query</li>
                    <li>Multi-Conversation Subscriptions</li>
                    <li>Settings</li>
                    <li>User Profiles</li>
                    <li>Branding</li>
                    <li>Tooltips</li>
                    <li>Typescript</li>
                </ul>
            </div>
            {/* Streamr Brubeck & Polish */}
            <div>
                <div className={styles.milestone}>
                    <h1>Streamr Brubeck & Polish</h1>
                    <h3>February 2022</h3>
                </div>
                <div className={styles.circle}/>
                <ul className={styles.checked}>
                    <li>UI / UX Redesign</li>
                    {/* <li>NFTs in messages</li> */}
                    {/* <li>ENS Support</li> */}
                    {/* <li>Pinned Ceramic Streams</li> */}
                    <li>Streamr Brubeck Update</li>
                    <li>Metadata (typing & online indicators)</li>
                </ul>
            </div>
            {/* Mycelium */}
            <div>
                <div className={styles.milestone}>
                    <h1>Mycelium</h1>
                    <h3>March 2022</h3>
                </div>
                <div className={styles.circle}/>
                <ul className={styles.checked}>
                    <li>Mycelium (Guilds)</li>
                    <li>Invitation UI</li>
                </ul>
            </div>
            {/* UX Improvements */}
            <div>
                <div className={styles.milestone}>
                    <h1>UX Improvements</h1>
                    <h3>Spring 2022</h3>
                </div>
                <div className={styles.circle}/>
                <ul>
                    <li>Markdown</li>
                    <li>Network Activity</li>
                    <li>Message Context Menu</li>
                    <li>Improved IPFS Integration</li>
                </ul>
            </div>
            {/* Data Unions */}
            <div>
                <div className={styles.milestone}>
                    <h1>Data Unions</h1>
                    <h3>Summer 2022</h3>
                </div>
                <div className={styles.circle}/>
                <ul>
                    <li>Data Unions for Mycelium</li>
                    <li>Android / IOS App</li>
                </ul>
            </div>
            {/* Audio Chat & Extensions */}
            <div>
                <div className={styles.milestone}>
                    <h1>Audio Chat & Extensions</h1>
                    <h3>Fall 2022</h3>
                </div>
                <div className={styles.circle}/>
                <ul>
                    <li>Audio Chat</li>
                    <li>Browser Extension</li>
                </ul>
            </div>
            {/* Video Chat & Integrations */}
            <div>
                <div className={styles.milestone}>
                    <h1>Video Chat & Integrations</h1>
                    <h3>Winter 2022</h3>
                </div>
                <div className={styles.circle}/>
                <ul>
                    <li>Video Chat</li>
                    <li>Integrations API</li>
                </ul>
            </div>
        </section>
        <Footer/>
    </>
  )
}

export default roadmap
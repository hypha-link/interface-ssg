import React, { useState } from 'react'
import { Profile } from "./settings/Profile";
import { ManageData } from './settings/ManageData';
import { Experimental } from './settings/Experimental';
import styles from '../styles/settings.module.css'

export const Settings = (props) => {
    const [tab, setTab] = useState('profile');

    const selectedTab = () => {
        switch(tab){
            case 'profile':
                return <Profile/>
            case 'manageData':
                return <ManageData/>
            case 'appearance':
                console.log("appearance");
                break;
            case 'notifications':
                console.log("notifications")
                break;
            case 'experimental':
                return <Experimental/>
        }
    }

    return (
        props.show ?
        <div id={styles.settings}>
            <nav>
                <h3>User Settings</h3>
                <ul>
                    <li><a onClick={() => setTab('profile')}>Profile</a></li>
                    <li><a onClick={() => setTab('manageData')}>Manage Data</a></li>
                </ul>
                <h3>App Settings</h3>
                <ul>
                    <li><a onClick={() => setTab('appearance')}>Appearance</a></li>
                    <li><a onClick={() => setTab('notifications')}>Notifications</a></li>
                    <li><a onClick={() => setTab('experimental')}>Experimental</a></li>
                </ul>
            </nav>
            <section>
                <button
                className={`${styles.cancel} hypha-button`}
                onClick={() => {
                    props.cancel();
                }}
                >
                X
                </button>
                {selectedTab()}
            </section>
        </div>
        :
        null
    )
}

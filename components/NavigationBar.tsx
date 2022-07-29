import styles from '../styles/navigationbar.module.css'
import Link from 'next/link'
import { useState } from 'react'
import Logo, { LogoTypes } from './svg/Logo';

export default function NavigationBar (){
    const [hideMobileMenu, setHideMobileMenu] = useState(true);

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <a className={`logoContainer`}>
                    <Logo LogoType={ LogoTypes.Hypha01 }/>
                    <h1>HYPHA</h1>
                </a>
            </Link>
            <div className={hideMobileMenu ? styles.hideMobileMenu : undefined}>
                <ul>
                    <li><Link href='/welcome'><a>Docs</a></Link></li>
                    <li><Link href='/network'><a>Network Activity</a></Link></li>
                    <li><Link href="/roadmap"><a>Roadmap</a></Link></li>
                </ul>
                <Link href="/app">
                    <a className={styles.enter}>Enter App</a>
                </Link>
            </div>
            <a className={styles.hamburger} onClick={() => setHideMobileMenu(!hideMobileMenu)}>☰</a>
        </nav>
    )
}
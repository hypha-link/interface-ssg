import styles from '../styles/index.module.css'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import HyphaLogo from "../public/hypha-01.svg"

export default function Index() {
  const [hideMobileMenu, setHideMobileMenu] = useState(true);

  return (
    <>
      <Head>
        <title>Hypha</title>
        <meta name="description" content="Hypha Messaging" />
        <link rel="icon" href="../favicon.ico" />
      </Head>
      <nav className={styles.nav}>
        <Link href="/">
          <a className={`logoContainer`}>
            <HyphaLogo/>
            <h1>Hypha</h1>
          </a>
        </Link>
        <div className={hideMobileMenu ? styles.hideMobileMenu : undefined}>
          <ul>
            <li><a href='#learn'>Learn</a></li>
            <li><a href='#activity'>Network Activity</a></li>
            <li><a href='#whitepaper'>Whitepaper</a></li>
          </ul>
          <Link href="/app">
            <a className={styles.enter}>Enter App</a>
          </Link>
        </div>
        <a className={styles.hamburger} onClick={() => setHideMobileMenu(!hideMobileMenu)}>☰</a>
      </nav>
      <main>
        <section className={styles.hero}>
          <div className={styles.desc}>
            <h2>Message peers.</h2>
            <h2>Own & control your data on the decentralized web.</h2>
            <p>We believe that private communication is the primary building block for connections. 
              The only way that we can obtain this is by challenging the status quo. 
              Hypha is taking on this difficult challenge by decentralizing communication as we know it.</p>
          </div>
          <div className={styles.threejs}>
            {/* Some kind of threejs thing */}
          </div>
        </section>
        <section className={styles.features}>
          <h1>Key Features</h1>
          <ul>
            <li>
              {/* <Image/> */}
              <div></div>
              <p>Private</p>
            </li>
            <li>
              {/* <Image/> */}
              <div></div>
              <p>Decentralized</p>
            </li>
            <li>
              {/* <Image/> */}
              <div></div>
              <p>Data Ownership</p>
            </li>
            <li>
              {/* <Image/> */}
              <div></div>
              <p>IPFS Support</p>
            </li>
            <li>
              {/* <Image/> */}
              <div></div>
              <p>Profiles</p>
            </li>
            <li>
              {/* <Image/> */}
              <div></div>
              <p>Data Union (Coming Soon)</p>
            </li>
          </ul>
        </section>
        <section className={styles.about}>

        </section>
      </main>
      <footer className={styles.footer}>
        <ul>
          <li><a href='https://gitlab.com/hypha-link' target='_blank' rel="noreferrer">Gitlab</a></li>
          <li><a href='https://twitter.com/hyphalink' target='_blank' rel="noreferrer">Twitter</a></li>
          <li><a href='https://www.youtube.com/channel/UC2lOBy3z83CXh0Ww66qdPOw' target='_blank' rel="noreferrer">Youtube</a></li>
          {/* <li><a href='https://medium.com/@hypha' target='_blank' rel="noreferrer">Medium</a></li> */}
          {/* <li><a>Hypha Discussion Server (Future)</a></li> */}
        </ul>
        {/* <ul>
          <li><a href='#Privacy'>Privacy Policy</a></li>
          <li><a href='#Terms'>Terms of Use</a></li>
        </ul> */}
        <ul>
          {/* <li><a href='#FAQ'>FAQ</a></li> */}
          <li><a href='mailto:connect@hypha.link'>Contact</a></li>
        </ul>
      </footer>
    </>
  )
}

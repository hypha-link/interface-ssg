import styles from '../styles/index.module.css'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

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
          <a className={`${styles.logo} logoContainer`}>
            <Image src='/hypha-01.png' alt="Logo" layout='fill' objectFit='contain' priority />
          </a>
        </Link>
        <div className={hideMobileMenu ? styles.hideMobileMenu : undefined}>
          <ul>
            <li><a href='#learn'>Learn</a></li>
            <li><a href='#activity'>Network Activity</a></li>
            <li><a href='#whitepaper'>Whitepaper</a></li>
            <li><a href='#docs'>Docs</a></li>
          </ul>
          <Link href="/app">
            <a className={styles.enter}>Enter App</a>
          </Link>
        </div>
        <a className={styles.hamburger} onClick={() => setHideMobileMenu(!hideMobileMenu)}>☰</a>
      </nav>
      <main>
        <section className={styles.hero}>
          <p>Message peers.
          <br/>Own & control your data on the decentralized web.</p>
        </section>
        <section className={styles.about}>
          <p>Hypha is a decentralized messaging application that you can use to directly send messages to your peers without ever touching a centralized server, & without relinquishing your control over your own data.</p>
        </section>
        <section className={styles.features}>
          <div>
            <div>
              {/* <Image/> */}
              <p>Private</p>
            </div>
            <div>
              {/* <Image/> */}
              <p>Decentralized</p>
            </div>
            <div>
              {/* <Image/> */}
              <p>Data Ownership</p>
            </div>
            <div>
              {/* <Image/> */}
              <p>IPFS Support</p>
            </div>
            <div>
              {/* <Image/> */}
              <p>Send Crypto</p>
            </div>
            <div>
              {/* <Image/> */}
              <p>Data Union (Coming Soon)</p>
            </div>
          </div>
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
        <ul>
          <li><a href='#Privacy'>Privacy Policy</a></li>
          <li><a href='#Terms'>Terms of Use</a></li>
        </ul>
        <ul>
          <li><a href='#FAQ'>FAQ</a></li>
          <li><a href='#Contact'>Contact</a></li>
        </ul>
      </footer>
    </>
  )
}

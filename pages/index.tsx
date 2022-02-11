import styles from '../styles/index.module.css'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import HyphaLogo from "../public/logo/hypha-01.svg"
import LayeredSteps from "../public/patterns/LayeredSteps.svg"
import CircleScatter from "../public/patterns/CircleScatter.svg"
import LowPolyGrid from "../public/patterns/LowPolyGrid.svg"
import SymbolScatter from "../public/patterns/SymbolScatter.svg"
import LayeredWaves from "../public/patterns/LayeredWaves.svg"
import BlobScene from "../public/patterns/BlobScene.svg"
import Gitlab from "../public/fa/gitlab.svg"
import Twitter from "../public/fa/twitter.svg"
import Youtube from "../public/fa/youtube.svg"

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
            <h1>HYPHA</h1>
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
        <section className={`${styles.hero} svgBackground svgWaveV`}>
          <div className={`${styles.desc}`}>
            <div>
              <h2>Decentralized communication where you're the owner</h2>
            </div>
            <p>We believe that private communication is the primary building block for making great connections with others. 
              Unfortunately, there aren't many options to choose from without watchful eyes on your data.
              The only way that we can change this is by challenging the status quo. 
              Hypha is taking on this difficult challenge by decentralizing communication as we know it.</p>
          </div>
          <div className={styles.threejs}>
            {/* Some kind of threejs thing */}
          </div>
        </section>
        <section className={styles.features}>
          <h1>The Future of Communication</h1>
          <ul>
            <li>
              <LayeredSteps/>
              <p>Private</p>
            </li>
            <li>
              <CircleScatter/>
              <p>Decentralized</p>
            </li>
            <li>
              <LowPolyGrid/>
              <p>Data Ownership</p>
            </li>
            <li>
              <SymbolScatter/>
              <p>IPFS Storage</p>
            </li>
            <li>
              <LayeredWaves/>
              <p>Profiles</p>
            </li>
            <li>
              <BlobScene/>
              <p>Ethereum Login</p>
            </li>
          </ul>
        </section>
        <section className={styles.about}>
          <h1>Powerful ethereum messaging at your fingertips</h1>
          <p>
            An Ethereum wallet is the only requirement to use Hypha. 
            Users can login and communicate in real-time with powerful instant messenger style features like typing indicators & online status. 
            Create profiles to more easily identify other users & groups. 
            All of the data created from interacting with Hypha is yours to control and decide the fate of!
          </p>
          <Link href="/app">
            <a className={styles.enter}>Enter App</a>
          </Link>
        </section>
      </main>
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
    </>
  )
}

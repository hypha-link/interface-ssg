import styles from '../styles/index.module.css'
import navStyles from '../styles/navigationbar.module.css'
import Head from 'next/head'
import Link from 'next/link'
import HyphaLogo from "../public/logo/hypha-01.svg"
import LayeredSteps from "../public/patterns/LayeredSteps.svg"
import CircleScatter from "../public/patterns/CircleScatter.svg"
import LowPolyGrid from "../public/patterns/LowPolyGrid.svg"
import SymbolScatter from "../public/patterns/SymbolScatter.svg"
import LayeredWaves from "../public/patterns/LayeredWaves.svg"
import BlobScene from "../public/patterns/BlobScene.svg"
import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'

export default function Index() {
  return (
    <>
      <Head>
        <title>Hypha</title>
        <meta name="description" content="Hypha Messaging" />
        <link rel="icon" href="../favicon.ico" />
      </Head>
      <NavigationBar/>
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
          <div className={styles.animation}>
            <div>
              <HyphaLogo/>
            </div>
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
            <a className={navStyles.enter}>Enter App</a>
          </Link>
        </section>
      </main>
      <Footer/>
    </>
  )
}

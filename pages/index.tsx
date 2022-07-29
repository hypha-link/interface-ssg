import styles from '../styles/index.module.css'
import navStyles from '../styles/navigationbar.module.css'
import Link from 'next/link'
import Logo, { LogoTypes } from '../components/svg/Logo'
import Patterns, { PatternTypes } from '../components/svg/Patterns'
import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'
import { KeyboardEvent, useState } from 'react'
import { ethers } from 'ethers'
import ProfileCard from '../components/ProfileCard'
import useProfile from '../components/hooks/useProfile'

export default function Index() {
  const [inputValue, setInputValue] = useState("");
  const profile = useProfile(inputValue);

  function keyHandler(keyEvent: KeyboardEvent<HTMLInputElement>){
    if (keyEvent.key === "Enter" && inputValue !== "" && ethers.utils.isAddress(inputValue.trim())) {
      // window.open(`/profile/${inputValue.trim()}`);
    }
  }
  return (
    <>
      <NavigationBar/>
      <main>
        <section className={`${styles.hero} svgBackground svgWaveV`}>
          <div className={`${styles.desc}`}>
            <div>
              <h2>Decentralized communication where you&apos;re the owner</h2>
            </div>
            <p>We believe that private communication is the primary building block for making great connections with others. 
              Unfortunately, there aren&apos;t many options to choose from without watchful eyes on your data.
              The only way that we can change this is by challenging the status quo. 
              Hypha is taking on this difficult challenge by decentralizing communication as we know it.</p>
          </div>
          <div className={styles.animation}>
            <div>
              <Logo LogoType={LogoTypes.Hypha01}/>
            </div>
          </div>
        </section>
        <section className={styles.profile}>
          <div className={styles.search}>
            <h1>Have your friends arrived yet?</h1>
            <input
              name="message"
              type="text"
              placeholder="Enter an Ethereum Address"
              value={inputValue}
              onInput={({currentTarget}) => {
                setInputValue(currentTarget.value);
              }}
              onKeyPress={(keyEvent) => keyHandler(keyEvent)}
              style={
                ethers.utils.isAddress(inputValue.trim()) || inputValue.trim() === "" ? 
                {textDecoration: 'none'} 
                : 
                {textDecoration: 'red wavy underline'}
              }
            ></input>
          </div>
          <ProfileCard profile={profile} portrait={false} />
        </section>
        <section className={styles.features}>
          <h1>The Future of Communication</h1>
          <ul>
            <li>
              <Patterns PatternType={PatternTypes.LayeredSteps}/>
              <p>Private</p>
            </li>
            <li>
              <Patterns PatternType={PatternTypes.CircleScatter}/>
              <p>Decentralized</p>
            </li>
            <li>
              <Patterns PatternType={PatternTypes.LowPolyGrid}/>
              <p>Data Ownership</p>
            </li>
            <li>
              <Patterns PatternType={PatternTypes.SymbolScatter}/>
              <p>IPFS Storage</p>
            </li>
            <li>
              <Patterns PatternType={PatternTypes.LayeredWaves}/>
              <p>Profiles</p>
            </li>
            <li>
              <Patterns PatternType={PatternTypes.BlobScene}/>
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

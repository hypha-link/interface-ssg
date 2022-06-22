import React, { useEffect, useRef, useState } from "react";
import styles from '../styles/tokenfeed.module.css'
import Image from 'next/image';
import cryptoManifest from '../node_modules/crypto-icons-plus/manifest.min.json'
import redstone from 'redstone-api';

type TokenFeedProps = {
  tokenName: string,
  tokenPrice: number,
  hideLiveFeedCheckbox: boolean,
  onClick?: () => void
}

export const TokenFeed = ({ tokenName, tokenPrice, hideLiveFeedCheckbox, onClick } : TokenFeedProps) => {
    const [liveFeed, setLiveFeed] = useState(false);
    const priceTimer = useRef<NodeJS.Timer>();

    const [liveTokenPrice, setliveTokenPrice] = useState("Loading...");
    useEffect(() => {

        if(liveFeed === true){
            priceTimer.current = setInterval(() => getPrice(), 60000);
        }
        else{
            clearInterval(priceTimer.current);
        }

        const getPrice = () =>{
            if(liveFeed === true){
                console.log("Updated Live Price");
                redstone.getPrice(tokenName).then((token) => setliveTokenPrice(token.value.toString()));
            }
        }
        getPrice();

        return () => {
            clearInterval(priceTimer.current);
        }

    }, [liveFeed, tokenName])

    //Get the full name of the token to reference the correct .png file in crypto=icons-plus
    const tokenFullName = cryptoManifest.filter(obj => {
      return obj.symbol === tokenName;
    })[0].slug;

  return (
    <section id={styles.tokenFeed} onClick={(e) => {onClick(); e.stopPropagation()}}>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <input className={hideLiveFeedCheckbox ? styles.hideLiveFeedCheckbox : ""} type="checkbox" onChange={(e) => setLiveFeed(e.target.checked)}></input>
      <div>
        {/* Toggle Live Feed */}
        <Image src={require(`../node_modules/crypto-icons-plus-128/src/${tokenFullName.toLowerCase()}.png`)} height="33%" width="33%" alt="cryptocurrency-icon" />
        <h1>{tokenName}</h1>
      </div>
      <p>{liveFeed ? liveTokenPrice : tokenPrice}</p>
      <div id={styles.creditContainer}>
        <p>Powered by</p>
        <div>
          <p style={{color: 'var(--redstone1)'}}>Red</p>
          <p style={{color: 'var(--redstone2)'}}>Stone</p>
        </div>
      </div>
    </section>
  );
};

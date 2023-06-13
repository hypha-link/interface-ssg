import React, { useState } from "react";
import styles from '../styles/tokenfeed.module.css'
import Image from 'next/image';
import cryptoManifest from '../node_modules/crypto-icons-plus/manifest.min.json'
import { usePriceData } from "./hooks/usePriceData";

type TokenFeedProps = {
  tokenName: string,
  tokenPrice: number,
  hideLiveFeedCheckbox: boolean,
  onClick?: () => void
}

export const TokenFeed = ({ tokenName, tokenPrice, hideLiveFeedCheckbox, onClick } : TokenFeedProps) => {
    const [liveFeed, setLiveFeed] = useState(false);
    const priceData = usePriceData(liveFeed, 10000, tokenName);

    //Get the full name of the token to reference the correct .png file in crypto=icons-plus
    const tokenFullName = cryptoManifest.filter(obj => {
      return obj.symbol === tokenName;
    });

  return (
    <section id={styles.tokenFeed} onClick={(e) => {onClick(); e.stopPropagation()}}>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <input className={hideLiveFeedCheckbox ? styles.hideLiveFeedCheckbox : ""} type="checkbox" onChange={(e) => setLiveFeed(e.target.checked)}></input>
      <div>
        {/* Toggle Live Feed */}
        <Image src={tokenFullName[0] ? require(`../node_modules/crypto-icons-plus-128/src/${tokenFullName[0].slug.toLowerCase()}.png`) : '/svg/QuestionMark.svg'} height="33%" width="33%" alt="cryptocurrency-icon" loading="lazy" />
        <h1>{tokenName}</h1>
      </div>
      <p>{liveFeed && priceData ? priceData.value : tokenPrice}</p>
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

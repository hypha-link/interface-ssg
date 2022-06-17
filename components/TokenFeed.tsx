import React, { useEffect, useState } from "react";
import styles from '../styles/tokenfeed.module.css'
import Image from 'next/image';
import {priceTwoDec, tokenAddr} from '../services/Chainlink_API';
import cryptoManifest from '../node_modules/crypto-icons-plus/manifest.min.json'

let priceTimer;

export const TokenFeed = (props) => {
    const [liveFeed, setLiveFeed] = useState(false);

    const [liveTokenPrice, setliveTokenPrice] = useState("Loading...");
    useEffect(() => {

        if(liveFeed === true){
            priceTimer = setInterval(() => getPrice(), 60000);
        }
        else{
            clearInterval(priceTimer);
        }

        const getPrice = () =>{
            if(liveFeed === true){
                console.log("Updated Live Price");
                priceTwoDec(tokenAddr.get(props.tokenName))
                .then((price) => setliveTokenPrice(price));
            }
        }
        getPrice();

        return () => {
            clearInterval(priceTimer);
        }

    }, [liveFeed, props.tokenName])

    //Get the full name of the token to reference the correct .png file in crypto=icons-plus
    const tokenFullName = cryptoManifest.filter(obj => {
      return obj.symbol === props.tokenName;
    })[0].slug;

  return (
    <section id={styles.tokenFeed} onClick={(e) => {props.onClick(); e.stopPropagation()}}>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <div className={liveFeed ? `${styles.wave} ${styles.water}` : `${styles.wave} ${styles.water} ${styles.staticFeed}`}></div>
    <input className={props.hideLiveFeedCheckbox ? styles.hideLiveFeedCheckbox : ""} type="checkbox" onChange={(e) => setLiveFeed(e.target.checked)}></input>
      <div>
        {/* Toggle Live Feed */}
        <Image src={require(`../node_modules/crypto-icons-plus-128/src/${tokenFullName.toLowerCase()}.png`)} height="33%" width="33%" alt="cryptocurrency-icon" />
        <h1>{props.tokenName}</h1>
      </div>
      <p>{liveFeed ? liveTokenPrice : props.tokenPrice}</p>
      <div id={styles.creditDiv}>
        <p>Powered by</p>
        <p id={styles.credit}>Chainlink</p>
      </div>
    </section>
  );
};

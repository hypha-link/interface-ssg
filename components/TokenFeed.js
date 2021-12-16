import React, { useEffect, useState } from "react";
import Image from 'next/image';
import {priceTwoDec, tokenAddr} from '../services/Chainlink_API';
import cryptoManifest from '../public/crypto-icons-plus/manifest.json';

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
    <section id="token-feed" onClick={() => props.onClick()}>
    <div className={liveFeed ? "wave water" : "wave water static-feed"}></div>
    <div className={liveFeed ? "wave water" : "wave water static-feed"}></div>
    <div className={liveFeed ? "wave water" : "wave water static-feed"}></div>
    <div className={liveFeed ? "wave water" : "wave water static-feed"}></div>
    <input className={props.hideLiveFeedCheckbox ? "hideLiveFeedCheckbox" : "showLiveFeedCheckbox"} type="checkbox" onChange={(e) => setLiveFeed(e.target.checked)}></input>
      <div>
        {/* Toggle Live Feed */}
        <Image src={require(`../public/crypto-icons-plus/128/${tokenFullName.toLowerCase()}.png`)} height="33%" width="33%" alt="cryptocurrency-icon" />
        <h1>{props.tokenName}</h1>
      </div>
      <p>{liveFeed ? liveTokenPrice : props.tokenPrice}</p>
      <div id="credit-div">
        <p>Powered by</p>
        <p id="credit">Chainlink</p>
      </div>
    </section>
  );
};

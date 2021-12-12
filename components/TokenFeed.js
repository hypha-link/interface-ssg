import React, { useEffect, useState } from "react";
// import Icon from "react-crypto-icons";
import {priceTwoDec, tokenAddr} from '../services/Chainlink_API';

// const cIcons = require.context('crypto-icons-plus/src/16/', false, /\.png$/);

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

  return (
    <section id="token-feed" onClick={() => props.onClick()}>
    <div className={liveFeed ? "wave water" : "wave water static-feed"}></div>
    <div className={liveFeed ? "wave water" : "wave water static-feed"}></div>
    <div className={liveFeed ? "wave water" : "wave water static-feed"}></div>
    <div className={liveFeed ? "wave water" : "wave water static-feed"}></div>
    <input className={props.hideLiveFeedCheckbox ? "hideLiveFeedCheckbox" : "showLiveFeedCheckbox"} type="checkbox" onChange={(e) => setLiveFeed(e.target.checked)}></input>
      <div>
        {/* Toggle Live Feed */}
        {/* <Icon name={props.tokenName.toString().toLowerCase()} size={25} /> */}
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

import React, { useEffect, useState } from 'react'
import { TokenFeed } from './TokenFeed'
import priceFeed, { tokenAddr, tokenAddrArr } from '../services/Chainlink_API'
const { ethers } = require("ethers")

export const ChainlinkFeeds = (props) => {
    const [tokenFeed, setTokenFeed] = useState([]);

    useEffect(() => {
        if(tokenFeed.length === 0)
        {
            let promises = [];
            tokenAddr.forEach((val) => {
                promises.push(priceFeed(val));
            })
        
            Promise.all(promises)
            .then((roundDataArr) => {
                let i = 0;
                let tokenFeedArr = [];
                roundDataArr.forEach(roundData => {
                    const name = tokenAddrArr[i].key;
                    tokenFeedArr.push(
                        <TokenFeed
                        key={roundData}
                        onClick={() => props.value("[" + name + "," + (ethers.BigNumber.from(roundData.answer._hex).toNumber() / 100000000).toFixed(2).toString() + "]")}
                        tokenName={name}
                        tokenPrice={(ethers.BigNumber.from(roundData.answer._hex).toNumber() / 100000000).toFixed(2).toString()}
                        hideLiveFeedCheckbox={true}
                        />
                    );
                    i++;
                });
                setTokenFeed(tokenFeedArr);
            })
        }
    })

    return (
        <section className={tokenFeed.length !== 0 ? "overlay" : "overlay loadingCLFeeds"} id="chainlink-feeds" onBlur={(e) => props.onBlur(e)}>
            {tokenFeed.length !== 0 ? tokenFeed :
                <p>
                    Loading...
                </p>
            }
        </section>
    )
}
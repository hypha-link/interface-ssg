import React, { useEffect, useState } from 'react'
import styles from '../styles/chainlinkfeeds.module.css'
import { TokenFeed } from './TokenFeed'
import priceFeed, { tokenAddr, tokenAddrArr } from '../services/Chainlink_API'
import { ethers } from "ethers"

type ChainlinkFeedsProps = {
    show: boolean
    value: (value: string) => void
    cancel: () => void
}

export const ChainlinkFeeds = ({ show, value, cancel } : ChainlinkFeedsProps) => {
    const [tokenFeed, setTokenFeed] = useState([]);

    useEffect(() => {
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
                    onClick={() => {
                        value("[" + name + "," + (ethers.BigNumber.from(roundData.answer._hex).toNumber() / 100000000).toFixed(2).toString() + "]");
                        cancel();
                    }}
                    tokenName={name}
                    tokenPrice={(ethers.BigNumber.from(roundData.answer._hex).toNumber() / 100000000).toFixed(2).toString()}
                    hideLiveFeedCheckbox={true}
                    />
                );
                i++;
            });
            setTokenFeed(tokenFeedArr);
        })
    }, [show])

    return (
        show ?
        <section className={tokenFeed.length !== 0 ? "overlay" : `overlay ${styles.loadingCLFeeds}`} id={styles.chainlinkFeeds} onBlur={() => cancel()}>
            {tokenFeed.length !== 0 ? tokenFeed :
                <p>
                    Loading...
                </p>
            }
        </section>
        :
        <></>
    )
}
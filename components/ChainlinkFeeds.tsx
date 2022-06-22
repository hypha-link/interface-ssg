import React, { useState } from 'react'
import styles from '../styles/chainlinkfeeds.module.css'
import { TokenFeed } from './TokenFeed'
import redstone from 'redstone-api';
import { PriceData } from 'redstone-api/lib/types'
import useMountEffect from './hooks/useMountEffect'

type ChainlinkFeedsProps = {
    show: boolean
    onClick: (value: string) => void
    cancel: () => void
}

export const ChainlinkFeeds = ({ show, onClick, cancel } : ChainlinkFeedsProps) => {
    const [priceData, setPriceData] = useState<PriceData[]>([]);

    useMountEffect(() => {
        const getPriceData = async () => {
            const allPrices = await redstone.getAllPrices({ provider: 'redstone-rapid' });
            setPriceData(Object.values(allPrices).reverse());
        }
        if(show) getPriceData();
    }, [show])

    return (
        show ?
        <section className={priceData.length !== 0 ? "overlay" : `overlay ${styles.loadingCLFeeds}`} id={styles.chainlinkFeeds} onBlur={() => cancel()}>
            {priceData.length !== 0 ? 
                priceData.map(({symbol, value}) => {
                    return(
                        <TokenFeed 
                            key={symbol}
                            tokenName={symbol}
                            tokenPrice={value}
                            hideLiveFeedCheckbox={true}
                            onClick={() => {
                                onClick(`[${symbol},${value}]`);
                                cancel();
                            }}
                        />
                    )
                })
                :
                <p>
                    Loading...
                </p>
            }
        </section>
        :
        <></>
    )
}
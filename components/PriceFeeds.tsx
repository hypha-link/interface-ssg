import React from 'react'
import styles from '../styles/pricefeeds.module.css'
import { TokenFeed } from './TokenFeed'
import { useAllPriceData } from './hooks/usePriceData';
import LoadingIcons from 'react-loading-icons'

type PriceFeedsProps = {
    show: boolean
    onClick: (value: string) => void
    cancel: () => void
}

export const PriceFeeds = ({ show, onClick, cancel } : PriceFeedsProps) => {
    const priceData = useAllPriceData(show, 30000, 'redstone-rapid');

    return (
        show ?
        <section className={priceData.length !== 0 ? "overlay" : `overlay ${styles.loading}`} id={styles.priceFeeds} onBlur={() => cancel()}>
            {
                priceData.length !== 0 ? 
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
                <LoadingIcons.Puff style={{ minWidth: '100px', minHeight: '100px' }} stroke="var(--appColor)" speed={2}/>
            }
        </section>
        :
        <></>
    )
}
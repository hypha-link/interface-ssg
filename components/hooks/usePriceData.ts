import { useState } from 'react'
import redstone from 'redstone-api';
import { PriceData } from 'redstone-api/lib/types';
import useInterval from './useInterval';

/**
 * Retrieve price data from RedStone.Finance
 * @param update Determines if the price data will update
 * @param updateFrequency How often in milliseconds the price data will update
 * @param tokenSymbol Optional token symbol to only request a single feed (retrieves all feeds if not specified).
 */
export function usePriceData(update: boolean, updateFrequency: number, tokenSymbol: string) {
    const [priceData, setPriceData] = useState<PriceData>();
    useInterval(() => getPriceData(), updateFrequency, update, true);

    const getPriceData = async () => {
        const feed = await redstone.getPrice(tokenSymbol);
        setPriceData(feed);
        console.info('Updating price data');
    }

    return(priceData);
}

/**
 * @param update Determines if the price data will update
 * @param updateFrequency How often in milliseconds the price data will update
 * @param provider Which redstone provider to use (redstone, redstone-rapid, redstone-stocks). The default is redstone.
 */
export function useAllPriceData( update: boolean, updateFrequency: number, provider = 'redstone') {
    const [priceData, setPriceData] = useState<PriceData[]>();
    useInterval(() => getPriceData(), updateFrequency, update, true);

    const getPriceData = async () => {
        const feed = await redstone.getAllPrices({ provider: provider });
        setPriceData(Object.values(feed).reverse());
        console.info('Updated Price Data');
    }

    return(priceData || []);
}
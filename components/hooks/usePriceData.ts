import { useRef, useState } from 'react'
import useMountEffect from './useMountEffect';
import redstone from 'redstone-api';
import { PriceData } from 'redstone-api/lib/types';

type usePriceDataType = {
    update: boolean
    updateFrequency: number
    provider?: string
}

/**
 * @param update Determines if the price data will update
 * @param updateFrequency How often in miliseconds the price data will update (10000 is the minimum)
 * @param provider Which redstone provider to use (redstone, redstone-rapid, redstone-stocks). The default is redstone.
 */
export default function usePriceData({ update, updateFrequency, provider = 'redstone' } : usePriceDataType) {
    const [priceData, setPriceData] = useState<PriceData[]>();
    const priceTimer = useRef<NodeJS.Timer>();
    
    useMountEffect(() => {
        const getPriceData = async () => {
            console.log('updating price data!');
            const allPrices = await redstone.getAllPrices({ provider: provider });
            setPriceData(Object.values(allPrices).reverse());
        }

        update ?
        priceTimer.current = setInterval(() => getPriceData(), updateFrequency >= 10000 ? updateFrequency : 30000)
        :
        clearInterval(priceTimer.current);

        return () => clearInterval(priceTimer.current);
    }, [update, updateFrequency])

    return(priceData || []);
}

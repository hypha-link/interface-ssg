import { ethers } from 'ethers';
import { useCallback, useContext } from 'react'
import { StateContext } from '../context/AppState'

const PolygonChainId = 137
const PUBLIC_INFURA_PROJECT_ID = ''

const PolygonNetworkInfo = {
    chainId: PolygonChainId,
    chainIdHex: `0x${PolygonChainId.toString(16)}`,
    name: 'Polygon Mainnet',
    endpoint: `https://polygon-mainnet.infura.io/v3/${PUBLIC_INFURA_PROJECT_ID}`,
    blockExplorer: 'https://polygonscan.com/',
    rpcUrl: 'https://polygon-rpc.com/',
    decimals: 18,
    symbol: 'MATIC',
}

export const requestNetworkChange = async (web3Provider: ethers.providers.Web3Provider) => {
    if(web3Provider?.network?.chainId !== PolygonNetworkInfo.chainId){
        console.warn('User is not connected to the Polygon Network, please approve a network switch.');
        const newNetwork = await web3Provider.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: PolygonNetworkInfo.chainIdHex,
                },
            ],
        })
        console.log(`Switched network to ${PolygonNetworkInfo.name}`);
        return newNetwork;
    }
}

export default function useEnsureCorrectNetwork() {
    const { web3Provider } = useContext(StateContext);

    return useCallback(async () => {
        if(!web3Provider){
            return;
        }
        await requestNetworkChange(web3Provider);
    }, [web3Provider])
}

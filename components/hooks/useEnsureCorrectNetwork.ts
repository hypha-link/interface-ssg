import { ethers } from 'ethers';
import { useCallback, useContext } from 'react'
import { StateContext } from '../context/AppState'

export default function useEnsureCorrectNetwork() {
    const { web3Provider } = useContext(StateContext);

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

    const requestNetworkChange = async (web3Provider: ethers.providers.Web3Provider) => {
        //Retrieve the web3Provider currently selected network
        const detectedNetwork = await web3Provider?.detectNetwork()
        //If the current network is not polygon, request the user to switch networks
        if(detectedNetwork.chainId !== PolygonNetworkInfo.chainId){
            console.warn('User is not connected to the Polygon Network, please approve a network switch.');
            const newNetwork = await web3Provider.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: PolygonNetworkInfo.chainIdHex,
                    },
                ],
            })
            console.info(`Attempting network switch to ${PolygonNetworkInfo.name}`);
            return newNetwork;
        }
    }

    return useCallback(async () => {
        if(!web3Provider){
            return;
        }
        await requestNetworkChange(web3Provider);
    }, [web3Provider])
}

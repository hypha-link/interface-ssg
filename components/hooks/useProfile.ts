import { EthereumAuthProvider, SelfID } from '@self.id/web';
import { ethers } from 'ethers';
import { useState } from 'react'
import useMountEffect from './useMountEffect';
import { Profile } from '../utils/Types';

export default function useProfile( address: string ) {
    const [profile, setProfile] = useState<Profile>();

    //Retrieve the relevant profile
    useMountEffect(() => {
        const getProfile = async () => {
            try{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const ownAddress = await provider.getSigner().getAddress();
            const selfId = await SelfID.authenticate({
                authProvider: new EthereumAuthProvider(window.ethereum, ownAddress),
                ceramic: 'testnet-clay',
                connectNetwork: 'testnet-clay',
            })
            //Retrieve the DID address associated with this ethereum address
            const didAddress = await selfId.client.getAccountDID(`${address}@eip155:${provider.network.chainId}`);
            //Return the basicProfile associated with this DID address
            setProfile({address: address, ...await selfId.client.get('basicProfile', didAddress)});
            }
            catch(e){
            console.warn(`There is no DID that exists for ${address}`);
            console.log(e);
            }
        }
        if(ethers.utils.isAddress(address)){
            getProfile();
        }
        else{
            console.log('returning null profile')
            setProfile(null);
        }
    }, [address])
        
    return(profile);
}

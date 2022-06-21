import { ethers } from 'ethers';
import { useState } from 'react'
import useMountEffect from './useMountEffect';
import { Profile } from '../utils/Types';
import { Core } from '@self.id/core';

export default function useProfile( address: string ) {
    const [profile, setProfile] = useState<Profile>();
    const core = new Core({ ceramic: 'testnet-clay' });

    //Retrieve the relevant profile
    useMountEffect(() => {
        const getProfile = async () => {
            try{
                // const provider = new ethers.providers.Web3Provider(window.ethereum);
                // provider?.network?.chainId

                //Polygon is default for now. Leaving provider for future chains.
                const chainId = '137';
                //Retrieve the DID address associated with this ethereum address
                const didAddress = await core.getAccountDID(`${address}@eip155:${chainId}`);
                //Return the basicProfile associated with this DID address
                setProfile({address: address, ...await core.get('basicProfile', didAddress)});
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
            console.log('Null profile');
            setProfile(null);
        }
    }, [address])
        
    return(profile);
}

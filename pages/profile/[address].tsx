import React, { useState } from 'react'
import styles from '../../styles/address.module.css';
import { useRouter } from 'next/router'
import { isAddress } from 'ethers/lib/utils';
import { EthereumAuthProvider, SelfID } from '@self.id/web';
import { ethers } from 'ethers';
import { Profile } from '../../components/utils/Types';
import useMountEffect from '../../components/hooks/useMountEffect';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import ProfileCard from '../../components/ProfileCard';
import Head from 'next/head';

export default function Address() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>();

  const { address } = router.query;
  const sAddress = typeof address  == 'string' && address;

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
        const didAddress = await selfId.client.getAccountDID(`${sAddress}@eip155:${provider.network.chainId}`);
        //Return the basicProfile associated with this DID address
        setProfile({address: sAddress, ...await selfId.client.get('basicProfile', didAddress)});
      }
      catch(e){
        console.warn(`There is no DID that exists for ${sAddress}`);
        console.log(e);
      }
    }
    //If the router query has been set, get the relevant profile
    if(address){
      getProfile();
    }
  }, [address])

  return (
    isAddress(sAddress) ?
    <>
      <Head>
        <title>{profile?.name || sAddress} | Hypha</title>
      </Head>
      <NavigationBar/>
      <div className={styles.address}>
        <ProfileCard profile={profile}/>
      </div>
      <Footer/>
    </>
    :
    <p>404</p>
  )
}

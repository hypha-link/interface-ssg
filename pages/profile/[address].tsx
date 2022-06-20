import React from 'react'
import styles from '../../styles/address.module.css';
import { useRouter } from 'next/router'
import { isAddress } from 'ethers/lib/utils';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import ProfileCard from '../../components/ProfileCard';
import Head from 'next/head';
import useProfile from '../../components/hooks/useProfile';

export default function Address() {
  const router = useRouter();
  const { address } = router.query;
  const sAddress = typeof address  == 'string' && address;

  const profile = useProfile(sAddress);

  return (
    isAddress(sAddress) ?
    <>
      <Head>
        <title>{profile?.name || sAddress} | Hypha</title>
        <meta name="description" content="Hypha Messaging" />
        <link rel="icon" href="../favicon.ico" />
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

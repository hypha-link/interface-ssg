import styles from '../styles/network.module.css'
import React from 'react'
import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'
import Head from 'next/head'

export default function Network(){
  return (
    <>
        <Head>
          <title>Network Activity | Hypha</title>
        </Head>
        <NavigationBar/>
        <section id={styles.network}>
            <iframe
                src='https://streamr.network/network-explorer/'
                title='Network Explorer'
            />
        </section>
        <Footer/>
    </>
  )
}
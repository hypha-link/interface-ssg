import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hypha</title>
        <meta name="description" content="Hypha Messaging" />
        <link rel="icon" href="../favicon.ico" />
      </Head>
      <main>
        <h1>Hypha</h1>
        <p>Welcome to the Hypha social messaging app.</p>
        <Link href="/app">Enter App</Link>
      </main>
      <footer className={styles.footer}>
        <h1>Hypha</h1>
      </footer>
    </div>
  )
}

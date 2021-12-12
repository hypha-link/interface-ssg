import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chime</title>
        <meta name="description" content="Chime Messaging" />
        <link rel="icon" href="../favicon.ico" />
      </Head>
      <main>
        <h1>Chime</h1>
        <p>Welcome to the Chime social messaging app.</p>
        <Link href="/app">Enter App</Link>
      </main>
      <footer className={styles.footer}>
        <h1>Chime</h1>
      </footer>
    </div>
  )
}

import '../styles/global.css'
import { Config, DAppProvider, Polygon} from '@usedapp/core'
import { AppProps } from 'next/dist/shared/lib/router/router'
import "@fontsource/montserrat-alternates"
import "@fontsource/montserrat"
import Head from 'next/head'
import AppState from '../components/context/AppState'

const config: Config = {
  networks: [Polygon],
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <AppState>
        <Head>
          <title>Hypha</title>
          <meta name="description" content="Hypha Messaging" />
          <link rel="icon" href="../favicon.ico" />
        </Head>
        <Component {...pageProps}/>
      </AppState>
    </DAppProvider>
  )
}

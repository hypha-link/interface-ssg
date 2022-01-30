import '../styles/global.css'
import { ChainId, DAppProvider} from '@usedapp/core'
import { AppProps } from 'next/dist/shared/lib/router/router'

const config= {
  supportedChains: [ChainId.Mainnet, ChainId.Ropsten, ChainId.Kovan, ChainId.Rinkeby],
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps}/>
    </DAppProvider>
  )
}

export default MyApp

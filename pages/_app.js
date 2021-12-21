import '../styles/global.css'
import { ChainId, Config, DAppProvider} from '@usedapp/core'

const config= {
  supportedChains: [ChainId.Mainnet, ChainId.Ropsten, ChainId.Kovan, ChainId.Rinkeby],
}

function MyApp({ Component, pageProps }) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps}/>
    </DAppProvider>
  )
}

export default MyApp

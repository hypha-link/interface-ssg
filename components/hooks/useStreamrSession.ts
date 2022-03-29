import { Wallet } from 'ethers';
import { useContext, useEffect } from 'react'
import { Actions } from '../context/AppContextTypes';
import { DispatchContext, StateContext } from '../context/AppState'
import useEnsureCorrectNetwork from '../hooks/useEnsureCorrectNetwork';

export default function SessionHandler() {
    const { ownProfile, web3Provider } = useContext(StateContext);
    const dispatch = useContext(DispatchContext);
    const ensureCorrectNetwork = useEnsureCorrectNetwork();
    const sessionStorage = 'encryptedPrivateKey';

    useEffect(() => {
        if(!web3Provider || !ownProfile?.address || !ensureCorrectNetwork){
            return
        }

        async function retrieve(){
            const encryptedPrivateKey = JSON.parse(localStorage.getItem(sessionStorage));
            await ensureCorrectNetwork();

            //Create new wallet
            if(!encryptedPrivateKey){
                const wallet = Wallet.createRandom()
                localStorage.setItem(sessionStorage, JSON.stringify(await wallet.encrypt(ownProfile.address)));
            }
            else{
                const wallet = await Wallet.fromEncryptedJson(encryptedPrivateKey, ownProfile.address);
                dispatch({ type: Actions.SET_STREAMR, payload: wallet });
            }
        }

        retrieve();
    }, [web3Provider, ownProfile?.address,])
}

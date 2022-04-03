import { useCallback, useContext } from 'react'
import { StreamPermission } from 'streamr-client';
import { StateContext } from '../components/context/AppState'

export default function ensureDelegatePermissions(streamId: string) {
    const { streamr, streamrDelegate } = useContext(StateContext);

    useCallback(async () => {
        //Grant publish permissions to the delegate if it doesn't have them already
        if(!await streamr.isStreamPublisher(streamId, streamrDelegate?.wallet.address)){
            await streamr.grantPermissions(streamId, 
                {
                    user: streamrDelegate?.wallet.address,
                    permissions: [StreamPermission.PUBLISH],
                }
            )
        }
    }, [streamId])
}

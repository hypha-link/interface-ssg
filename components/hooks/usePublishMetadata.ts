import { useContext, useEffect, useState } from 'react';
import { Conversations, Metadata } from '../utils/Types';
import { StateContext } from '../context/AppState';
import { StreamPermission } from 'streamr-client';
import useInterval from './useInterval';

/**
 * A hook to publish metadata to the Streanr Network
 * @param _conversation The conversation to publish metadata to.
 * @returns Returns a dispatch to set the metadata to publish & the time remaining in milliseconds until metadata can be sent again.
 */
export default function usePublishMetadata(_conversation: Conversations){
    const { ownProfile, streamr, streamrDelegate } = useContext(StateContext);
    const [sendMetadata, setSendMetadata] = useState<Metadata>();
    const [lastSentMetadata, setLastSentMetadata] = useState<Metadata>({address: '', typing: false, invite: ''});
    const timeRemaining = useInterval(
        () => setLastSentMetadata(oldMetadata => ({...oldMetadata, invite: ''})), 
        10000, 
        lastSentMetadata?.invite?.length !== 0,
        { loops: 1 }
    );

    //Send metadata to partner
    useEffect(() => {
        const publishMetadata = async () => {
          try{
            //Grant publish permissions to the delegate if it doesn't have them already
            if(!await streamr.isStreamPublisher(_conversation.streamId, streamrDelegate?.wallet.address)){
              console.log(streamrDelegate?.wallet.address);
              console.log(await streamr.getAddress())
              console.log(_conversation.streamId)
              await streamr.grantPermissions(_conversation.streamId, 
                {
                  user: streamrDelegate?.wallet.address,
                  permissions: [StreamPermission.PUBLISH],
                }
              )
            }
            await streamrDelegate?.client.publish(
              { streamId: _conversation.streamId, partition: 1 },
              {
                address: ownProfile.address,
                typing: sendMetadata.typing,
                online: sendMetadata.online,
                receipt: sendMetadata.receipt,
                invite: sendMetadata.invite,
              },
            )
            console.log(sendMetadata);
          }
          catch(e){
            alert('Please fund the connected wallet with Matic tokens to use Hypha');
            console.error(e);
          }
        }
        //Only send new metadata
        if(_conversation?.streamId && _conversation?.streamId !== "" && JSON.stringify(lastSentMetadata) !== JSON.stringify(sendMetadata)){
          console.info('Published Metadata');
          setLastSentMetadata(sendMetadata);
          publishMetadata();
        }
    }, [sendMetadata]);

  return [setSendMetadata, timeRemaining] as const;
};
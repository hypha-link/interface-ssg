import { useContext, useEffect, useState } from 'react';
import { Conversations, Metadata } from '../utils/Types';
import { StateContext } from '../context/AppState';
import { StreamPermission } from 'streamr-client';
import useInterval from './useInterval';

export default function usePublishMetadata(_conversation: Conversations){
    const { ownProfile, streamr, streamrDelegate } = useContext(StateContext);
    const [sendMetadata, setSendMetadata] = useState<Metadata>();
    const [lastSentMetadata, setLastSentMetadata] = useState<Metadata>();
    const timeRemaining = Math.ceil(
      useInterval(
        () => setLastSentMetadata(oldMetadata => ({...oldMetadata, invite: ''})), 
        10000, 
        lastSentMetadata?.invite !== undefined && lastSentMetadata?.invite?.length !== 0, 
        false, 
        1
      ) / 1000
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
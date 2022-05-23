import { useContext, useEffect, useState } from 'react';
import { Conversations, Metadata } from '../utils/Types';
import { StateContext } from '../context/AppState';
import { StreamPermission } from 'streamr-client';
import useMountEffect from './useMountEffect';

export default function usePublishMetadata(_conversation: Conversations){
    const { ownProfile, streamr, streamrDelegate } = useContext(StateContext);
    const [sendMetadata, setSendMetadata] = useState<Metadata>();
    const [lastSentMetadata, setLastSentMetadata] = useState<Metadata>();
    const [timeRemaining, setTimeRemaining] = useState(10);

    useMountEffect(() => {
      if(lastSentMetadata?.invite !== ''){
        //Stop user from inviting a friend more than once every 10 seconds
        let timeleft = 10;
        let timer = setInterval(() => {
          if(timeleft <= 1){
            setLastSentMetadata(oldMetadata => ({...oldMetadata, invite: ''}));
            setTimeRemaining(10);
            clearInterval(timer);
          }
          else{
            timeleft -= 1;
            setTimeRemaining(timeleft);
          }
        }, 1000)
        return () => {
          clearInterval(timer);
        }
      }
    }, [lastSentMetadata?.invite])

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
            console.log(sendMetadata)
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
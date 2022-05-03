import { useContext, useEffect, useState } from 'react';
import { Conversations, Metadata } from '../utils/Types';
import getConversationProfile from '../../get/getConversationProfile';
import { StateContext } from '../context/AppState';
import { StreamPermission } from 'streamr-client';

export default function useMetadata(_conversation: Conversations){
    const { ownProfile, streamr, streamrDelegate } = useContext(StateContext);
    const [sendMetadata, setSendMetadata] = useState<Metadata>();
    const [lastSentMetadata, setLastSentMetadata] = useState<Metadata>();
    const [receiveMetadata, setReceiveMetadata] = useState<Metadata>({address: '', typing: false, online: false, receipt: false});

    //Receive metadata from partner
    useEffect(() => {
        const loadMetadata = async () => {
          const subs = await streamr.getSubscriptions({ streamId: _conversation.streamId });
          if(subs.length !== 0){
              console.log(`Subscribing to ${getConversationProfile(_conversation)?.name || getConversationProfile(_conversation)?.address} metadata`);
              await streamr.subscribe({ streamId: _conversation.streamId, partition: 1 },
                  (data: Metadata) => {
                      if(data.address !== ownProfile.address){
                      setReceiveMetadata({ address: data.address, typing: data.typing, online: data.online });
                      }
                  });
          }
        }
        if(_conversation.streamId !== ""){
          loadMetadata();
        }
    }, [_conversation]);

    //Send metadata to partner
    useEffect(() => {
        const publishMetadata = async () => {
          try{
            //Grant publish permissions to the delegate if it doesn't have them already
            if(!await streamr.isStreamPublisher(_conversation.streamId, streamrDelegate?.wallet.address)){
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
              },
            )
          }
          catch(e){
            alert('Please fund the connected wallet with Matic tokens to use Hypha');
            console.error(e);
          }
        }
        //Only send new metadata
        if(_conversation.streamId !== "" && JSON.stringify(lastSentMetadata) !== JSON.stringify(sendMetadata)){
          setLastSentMetadata(sendMetadata);
          publishMetadata();
        }
        }, [sendMetadata]);

  return [receiveMetadata, setSendMetadata] as const;
};
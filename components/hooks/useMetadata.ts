import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { Conversations, Metadata } from '../utils/Types';
import { streamr } from '../../services/Streamr_API';
import getHyphaProfile from '../../get/getHyphaProfile';

export default function useMetadata(_conversation: Conversations){
    const { account } = useEthers();
    const [sendMetadata, setSendMetadata] = useState<Metadata>();
    const [lastSentMetadata, setLastSentMetadata] = useState<Metadata>();
    const [receiveMetadata, setReceiveMetadata] = useState<Metadata>({address: '', typing: false, online: false, receipt: false});

    //Receive metadata from partner
    useEffect(() => {
        const loadMetadata = async () => {
          const subs = await streamr.getSubscriptions({ streamId: _conversation.streamId });
          if(subs.length !== 0){
              console.log(`Subscribing to ${getHyphaProfile(_conversation)?.name || getHyphaProfile(_conversation)?.address} metadata`);
              await streamr.subscribe({ streamId: _conversation.streamId, partition: 1 },
                  (data: Metadata) => {
                      if(data.address !== account){
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
          await streamr.publish(
            { streamId: _conversation.streamId, partition: 1 },
            {
            address: account,
            typing: sendMetadata.typing,
            online: sendMetadata.online,
            },
          )
        }
        //Only send new metadata
        if(_conversation.streamId !== "" && JSON.stringify(lastSentMetadata) !== JSON.stringify(sendMetadata)){
          setLastSentMetadata(sendMetadata);
          publishMetadata();
        }
        }, [sendMetadata]);

  return [receiveMetadata, setSendMetadata] as const;
};
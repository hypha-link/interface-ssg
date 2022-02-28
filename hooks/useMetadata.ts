import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { Friends, Metadata } from '../components/utilities/Types';
import { streamr } from '../services/Streamr_API';

export default function useMetadata(_friend: Friends){
    const { account } = useEthers();
    const [sendMetadata, setSendMetadata] = useState<Metadata>();
    const [lastSentMetadata, setLastSentMetadata] = useState<Metadata>();
    const [receiveMetadata, setReceiveMetadata] = useState<Metadata>({address: '', typing: false, online: false, receipt: false});

    //Receive metadata from partner
    useEffect(() => {
        const loadMetadata = async () => {
          const subs = await streamr.getSubscriptions({ streamId: _friend.streamID });
          if(subs.length !== 0){
              console.log(`Subscribing to ${_friend?.profile?.name || _friend.address} metadata`);
              await streamr.subscribe({ streamId: _friend.streamID, partition: 1 },
                  (data: Metadata) => {
                      if(data.address !== account){
                      setReceiveMetadata({ address: data.address ,typing: data.typing, online: data.online });
                      } 
                  });
          }
        }
        if(_friend.streamID !== ""){
          loadMetadata();
        }
    }, [_friend]);

    //Send metadata to partner
    useEffect(() => {
        const publishMetadata = async () => {
          await streamr.publish(
            { streamId: _friend.streamID, partition: 1 },
            {
            address: account,
            typing: sendMetadata.typing,
            online: sendMetadata.online,
            },
          )
        }
        //Only send new metadata
        if(_friend.streamID !== "" && JSON.stringify(lastSentMetadata) !== JSON.stringify(sendMetadata)){
          setLastSentMetadata(sendMetadata);
          publishMetadata();
        }
        }, [sendMetadata]);

  return [receiveMetadata, setSendMetadata] as const;
};
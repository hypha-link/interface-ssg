import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { Friends, Metadata } from '../interfaces/Types';
import getOrCreateMessageStream, { HyphaType, streamrUnsigned } from '../services/Streamr_API';

export default function useMetadata(_streamID: string){
    const { account } = useEthers();
    const [sendMetadata, setSendMetadata] = useState<Metadata>();
    const [receiveMetadata, setReceiveMetadata] = useState<Metadata>();

    const firstAddress = _streamID.substring(0, _streamID.indexOf("/"));
    const secondAddress = _streamID.substring(_streamID.lastIndexOf("/") + 1, _streamID.length);

    let friendAddress = '';
    //Set the friend address to whichever part of the ID isn't the auth account address
    if(account)
    friendAddress = firstAddress !== account.toLowerCase() ? firstAddress : secondAddress;

    //Receive metadata from partner
    useEffect(() => {
        const loadMetadata = async () => {
            streamrUnsigned.getStream(`${firstAddress}/hypha-metadata/${secondAddress}`).then(async (stream) => {
                if(!streamrUnsigned.getSubscriptions().some(subscription => subscription.streamId === `${firstAddress}/hypha-metadata/${secondAddress}`)){
                    console.log("Subscribing to metadata");
                    await streamrUnsigned.subscribe({ stream: stream.id },
                        (data) => {
                            if(data.address !== account.toLowerCase()){
                            setReceiveMetadata({ typing: data.typing, online: data.online });
                            } 
                        });
                }
            //If Metadata doesn't exist, create a new one
            }).catch(async () => {
            console.log("Making new stream")
            const stream = await getOrCreateMessageStream(friendAddress, HyphaType.Metadata);
            await streamrUnsigned.subscribe({ stream: stream.id },
              (data) => {
                if(data.address !== account.toLowerCase()){
                  setReceiveMetadata({ typing: data.typing, online: data.online });
                  console.log(data);
                } 
              });
          })
        }
        if(_streamID !== ""){
          loadMetadata();
        }
    }, [_streamID]);

    //Send metadata to partner
    useEffect(() => {
        const publishMetadata = async () => {
            const stream = await streamrUnsigned.getStream(`${firstAddress}/hypha-metadata/${secondAddress}`);
            await stream.publish({
            address: account.toLowerCase(),
            typing: sendMetadata.typing,
            online: sendMetadata.online,
            })
        }
        if(friendAddress !== ""){
            publishMetadata();
        }
        }, [sendMetadata]);

  return [receiveMetadata, setSendMetadata] as const;
};
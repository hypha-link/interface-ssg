import StreamrClient, { Stream, StreamPermission } from "streamr-client";

const STREAMR_GERMANY = '0x31546eEA76F2B2b3C5cC06B1c93601dc35c9D916';

export enum ConversationType{
  Hypha = "hypha",
  Hyphae = "hyphae",
  Mycelium = "mycelium",
}

/**
 * @returns Message Stream
 */
export default async function getOrCreateMessageStream(streamr: StreamrClient, _identifier: string, _type: ConversationType, _addToStorage?: boolean) {

  //Get the address of the connected wallet
  const account = await streamr.getAddress();

  const createHypha = async () => {
    try{
      const streamProps =
      {
        id: `${account}/hypha/${_identifier}`,
        description: "Hypha (Direct messages)",
        config: {
          fields: [{name: "sender", type: "string"},{name: "message", type: "string"},{name: "date", type: "number"}],
        },
        partitions: 2,
        requireSignedData: false,
        requireEncryptedData: false,
        storageDays: 1,
        inactivityThresholdHours: 1,
      }
      //Create a new message stream or select one that exists
      const stream = await streamr.getOrCreateStream(streamProps);
      //Grant permissions to selected conversation
      await stream.grantPermissions({
        user: _identifier,
        permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE, StreamPermission.GRANT, StreamPermission.EDIT, StreamPermission.DELETE]
      })
      //Add storage if not already added
      if(_addToStorage && !(await stream.getStorageNodes()).includes(STREAMR_GERMANY.toLowerCase())){
        await stream.addToStorageNode(STREAMR_GERMANY);
      }
      return stream;
    }
    catch(e){
      console.error('The stream could not be created');
    }
  }

  const createHyphae = async () => {
    try{
      const streamProps =
      {
        id: `${account}/hyphae/${_identifier}`,
        description: "Hyphae (Group messages)",
        config: {
          fields: [{name: "sender", type: "string"},{name: "message", type: "string"},{name: "date", type: "number"}],
        },
        partitions: 2,
        requireSignedData: false,
        requireEncryptedData: false,
        storageDays: 1,
        inactivityThresholdHours: 1,
      }
      //Create a new message stream or select one that exists
      const stream = await streamr.getOrCreateStream(streamProps);
      //Add storage if not already added
      if(_addToStorage && !(await stream.getStorageNodes()).includes(STREAMR_GERMANY.toLowerCase())){
        await stream.addToStorageNode(STREAMR_GERMANY);
      }
      return stream;
    }
    catch(e){
      console.error('The stream could not be created');
    }
  }

  const createMycelium = async () => {
    try{
      const streamProps =
      {
        id: `${account}/mycelium/${_identifier}`,
        description: "Mycelium (Server messages)",
        config: {
          fields: [{name: "sender", type: "string"},{name: "message", type: "string"},{name: "date", type: "number"}],
        },
        partitions: 2,
        requireSignedData: false,
        requireEncryptedData: false,
        storageDays: 1,
        inactivityThresholdHours: 1,
      }
      //Create a new message stream or select one that exists
      const stream = await streamr.getOrCreateStream(streamProps);
      //Add storage if not already added
      if(_addToStorage && !(await stream.getStorageNodes()).includes(STREAMR_GERMANY.toLowerCase())){
        await stream.addToStorageNode(STREAMR_GERMANY);
      }
      return stream;
    }
    catch(e){
      console.error('The stream could not be created');
    }
  }

  switch(_type){
    case ConversationType.Hypha:
      return createHypha();
    case ConversationType.Hyphae:
      return createHyphae();
    case ConversationType.Mycelium:
      return createMycelium();
    default:
      return createHypha();
  }
};

export const revokeUserPermissions = async (_stream: Stream, _address: string) => {
  await _stream.revokePermissions({
    user: _address,
    permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE, StreamPermission.GRANT, StreamPermission.EDIT, StreamPermission.DELETE],
  })
}
import StreamrClient, { Stream, StreamPermission } from "streamr-client";

const STREAMR_GERMANY = '0x31546eEA76F2B2b3C5cC06B1c93601dc35c9D916';

//Create the Streamr client
const streamrClient = () => {
  let client = undefined;
  try{
    //@ts-ignore
    const { ethereum } = window;
    client = new StreamrClient({
      auth: {ethereum},
    })
  }
  catch{
    console.log("User needs to be signed in with an Ethereum wallet to authenticate Streamr.");
  }
  return client;
}

export const streamr: StreamrClient = streamrClient();

export enum HyphaType{
  Hypha = "hypha",
  Hyphae = "hyphae",
  Mycelium = "mycelium",
}

/**
 * @returns Message Stream
 */
export default async function getOrCreateMessageStream(_address: string, _type: HyphaType, _addToStorage?: boolean) {

  //Get the address of the connected wallet
  const account = await streamr.getAddress();

  const createHypha = async () => {
    const streamProps =
    {
      id: `${account}/hypha/${_address}`,
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
      user: _address,
      permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE, StreamPermission.GRANT, StreamPermission.EDIT, StreamPermission.DELETE]
    })
    //Add storage if not already added
    if(_addToStorage && !(await stream.getStorageNodes()).includes(STREAMR_GERMANY.toLowerCase())){
      await stream.addToStorageNode(STREAMR_GERMANY);
    }
    return stream;
  }

  const createHyphae = async () => {
    const streamProps =
    {
      id: `${account}/hyphae/${_address.substring(_address.length - 4, _address.length)}`,
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
    //Grant permissions to selected conversation
    await stream.grantPermissions({
      user: _address,
      permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE, StreamPermission.GRANT, StreamPermission.EDIT, StreamPermission.DELETE]
    })
    //Add storage if not already added
    if(_addToStorage && !(await stream.getStorageNodes()).includes(STREAMR_GERMANY.toLowerCase())){
      await stream.addToStorageNode(STREAMR_GERMANY);
    }
    return stream;
  }

  const createMycelium = async () => {
    const streamProps =
    {
      id: `${account}/mycelium/${_address}`,
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
    //Grant permissions to selected conversation
    await stream.grantPermissions({
      user: _address,
      permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE, StreamPermission.GRANT, StreamPermission.EDIT, StreamPermission.DELETE],
    })
    //Add storage if not already added
    if(_addToStorage && !(await stream.getStorageNodes()).includes(STREAMR_GERMANY.toLowerCase())){
      await stream.addToStorageNode(STREAMR_GERMANY);
    }
    return stream;
  }

  switch(_type){
    case HyphaType.Hypha:
      return createHypha();
    case HyphaType.Hyphae:
      return createHyphae();
    case HyphaType.Mycelium:
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
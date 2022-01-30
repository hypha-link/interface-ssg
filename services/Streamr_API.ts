import StreamrClient, { StorageNode, Stream } from "streamr-client";

//Create the Streamr client
const streamrClient = () => {
  let client = undefined;
  try{
    //@ts-ignore
    const { ethereum } = window;
    client = new StreamrClient({
      auth: {ethereum},
      publishWithSignature: "always",
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
  const ownerAddress = await streamr.getAddress();

  const createHypha = async () => {
    const streamProps =
    {
      id: `${ownerAddress}/hypha-messages/${_address}`,
      description: "The messages that you have sent using Hypha",
      config: {
        fields: [{name: "sender", type: "string"},{name: "message", type: "string"},{name: "date", type: "number"}],
      },
      partitions: 1,
      requireSignedData: true,
      requireEncryptedData: false,
      storageDays: 1,
      inactivityThresholdHours: .5,
    }
    //Create a new message stream or select one that exists
    const stream = await streamr.getOrCreateStream(streamProps);
    //Grant permissions to selected friend
    grantPermissions(stream, _address, PermissionType.Owner);
    //Add storage
    _addToStorage && await stream.addToStorageNode(StorageNode.STREAMR_GERMANY);
    return stream;
  }

  const createHyphae = async () => {
    const streamProps =
    {
      id: `${ownerAddress}/hyphae/${_address.substring(_address.length - 4, _address.length)}`,
      description: "The group messages that you have sent using Hypha",
      config: {
        fields: [{name: "sender", type: "string"},{name: "message", type: "string"},{name: "date", type: "number"}],
      },
      partitions: 1,
      requireSignedData: true,
      requireEncryptedData: false,
      storageDays: 1,
      inactivityThresholdHours: .5,
    }
    //Create a new message stream or select one that exists
    const stream = await streamr.getOrCreateStream(streamProps);
    //Grant permissions to selected friend
    grantPermissions(stream, _address, PermissionType.Owner);
    //Add storage
    _addToStorage && await stream.addToStorageNode(StorageNode.STREAMR_GERMANY);
    return stream;
  }

  const createMycelium = async () => {
    const streamProps =
    {
      id: `${ownerAddress}/hyphae/${_address.substring(_address.length - 4, _address.length)}`,
      description: "The group messages that you have sent using Hypha",
      config: {
        fields: [{name: "sender", type: "string"},{name: "message", type: "string"},{name: "date", type: "number"}],
      },
      partitions: 1,
      requireSignedData: true,
      requireEncryptedData: false,
      storageDays: 1,
      inactivityThresholdHours: .5,
    }
    //Create a new message stream or select one that exists
    const stream = await streamr.getOrCreateStream(streamProps);
    //Grant permissions to selected friend
    grantPermissions(stream, _address, PermissionType.Owner);
    //Add storage
    _addToStorage && await stream.addToStorageNode(StorageNode.STREAMR_GERMANY);
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

export enum PermissionType{
  Owner = "owner",
  Editor = "editor",
  Publisher = "publisher",
  Subscriber = "subscriber",
  User = "user",
}

export const grantPermissions = async (_stream: Stream, _address: string, permissions: PermissionType) => {
  try{
    switch(permissions){
      case PermissionType.Owner:
        //@ts-ignore
        await _stream.grantPermission("stream_get", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_publish", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_subscribe", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_delete", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_edit", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_share", _address);
        break;
      case PermissionType.Editor:
        //@ts-ignore
        await _stream.grantPermission("stream_get", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_publish", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_subscribe", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_edit", _address);
        break;
      case PermissionType.Publisher:
        //@ts-ignore
        await _stream.grantPermission("stream_get", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_publish", _address);
        break;
      case PermissionType.Subscriber:
        //@ts-ignore
        await _stream.grantPermission("stream_get", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_subscribe", _address);
        break;
      case PermissionType.User:
        //@ts-ignore
        await _stream.grantPermission("stream_get", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_publish", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_subscribe", _address);
        break;
      default:
        //@ts-ignore
        await _stream.grantPermission("stream_get", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_publish", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_subscribe", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_delete", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_edit", _address);
        //@ts-ignore
        await _stream.grantPermission("stream_share", _address);
    }
  }
  catch(e){
    console.log(e);
  }
}

export const revokeUserPermissions = async (_stream: Stream, _address: string) => {
  const streamPermissions = await _stream.getPermissions();
  streamPermissions.map(async(permission) => {
    if(permission.user === _address.toLowerCase()){
      await _stream.revokePermission(permission.id);
    }
  })
}
import StreamrClient from "streamr-client";

const axios = require('axios').default;
const { ethereum } = window;

//Address of the Streamr storage node
const STREAMR_GERMANY = '0x31546eEA76F2B2b3C5cC06B1c93601dc35c9D916';

export const streamr = new StreamrClient({
  auth: {ethereum},
  publishWithSignature: "always",
})

/**
 * @returns Message Stream
 */
export default async function getOrCreateMessageStream(_address, _addToStorage){
    //Get the address of the connected wallet
    const ownerAddress = await streamr.getAddress();
    //Create a new message stream or select one that exists
    const stream = await streamr.getOrCreateStream({
      id: ownerAddress.toLowerCase() + "/hypha-messages/" + _address,
      name: "Hypha Messages",
      description: "The messages that you have sent using Hypha",
      config: {
        fields: [
          {
            sender: "string",
            message: "string",
            date: "number",
          },
        ],
      },
      partitions: 1,
      requireSignedData: true,
      requireEncryptedData: false,
      autoConfigure: true,
      storageDays: 1,
      inactivityThresholdHours: .5,
    });
    //Grant permissions to selected friend
    grantPermissions(stream, _address)
    //Add storage
    _addToStorage && await stream.addToStorageNode(STREAMR_GERMANY);
    return stream;
  };

  const grantPermissions = async (_stream, _address) => {
    await _stream.grantPermission("stream_get", _address);
    await _stream.grantPermission("stream_publish", _address);
    await _stream.grantPermission("stream_subscribe", _address);
    await _stream.grantPermission("stream_delete", _address);
    await _stream.grantPermission("stream_edit", _address);
    // await _stream.grantPermission("stream_share", _address);
  }

  /**
   * @returns Stream creation time since epoch (milliseconds)
   */
  export const getStreamCreation = async (_address) => {
    const stream = await getOrCreateMessageStream(_address);
    return new Date(stream.dateCreated).getTime()
  }

  /**
   * @returns Last message of stream
   */
  export const getStreamLast = async (_address) => {
    const stream = await getOrCreateMessageStream(_address);
    const lastMessage = await streamr.getStreamLast(stream.id);
    return lastMessage[0].content;
  }

  /**
 * @deprecated Use streams to receive a resend callback instead
 * @returns All messages since stream creation
 */
  export const getStreamData = async (_address) => {
    const stream = await getOrCreateMessageStream(_address);
    const result = await axios.request({
      "method": "get",
      "url": "https://streamr.network/api/v1/streams/" + encodeURIComponent(stream.id) + "/data/partitions/0/from",
      "headers": {
        "Content-Type": "application/json",
        "authorization": "Bearer ZbZI0GhKxE7Z3U1lZ5a6YhoI2MKb23SHBm35n4T7eyI5qs1BfX6Oe7YU07lSyGNr"
      },
      "params": {
        "fromTimestamp": await getStreamCreation()
      }
    })
    return result.data;
  }
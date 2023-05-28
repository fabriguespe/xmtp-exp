const ENCODING = "binary";
import {} from "dotenv/config";
import axios from "axios";

import {
  AttachmentCodec,
  RemoteAttachmentCodec,
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
} from "xmtp-content-type-remote-attachment";

export const getEnv = () => {
  //"dev" | "production" | "local"
  return process.env.XMTP_ENV || "dev";
};

export const buildLocalStorageKey = (walletAddress) =>
  walletAddress ? `xmtp:${getEnv}:keys:${walletAddress}` : "";

export const loadKeys = (walletAddress) => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};
export const storeKeys = (walletAddress, keys) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING),
  );
};

export const encodeRemoteAttachment = async (file) => {
  const imgData = await loadFile(file);

  const attachment = {
    filename: file.name,
    mimeType: file.type,
    data: imgData,
  };

  const attachmentCodec = new AttachmentCodec();
  //encodeEncrypted is a helper function to encrypt the file
  const encryptedAttachment = await RemoteAttachmentCodec.encodeEncrypted(
    attachment,
    attachmentCodec,
  );

  const uploadUrl = await upload({
    //encryptedAttachment.payload.buffer is a Uint8Array
    //We need to convert it to a File to upload it to the IPFS network
    data: [new File([encryptedAttachment.payload.buffer], file.name)], // Convert Uint8Array back to File
    options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
  });
  //uploadUrl[0] is the IPFS hash of the ecnrypted file

  const remoteAttachment = {
    url: uploadUrl[0],
    contentDigest: encryptedAttachment.digest,
    salt: encryptedAttachment.salt,
    nonce: encryptedAttachment.nonce,
    secret: encryptedAttachment.secret,
    scheme: "https://",
    filename: attachment.filename,
    contentLength: attachment.data.byteLength,
  };

  return {
    attachment: remoteAttachment,
    options: {
      contentType: ContentTypeRemoteAttachment,
      contentFallback: "a screenshot of over 1MB",
    },
  };
};

export const wipeKeys = (walletAddress) => {
  // This will clear the conversation cache + the private keys
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

// This method receives the message.content as attachment, the xmtp client and the RemoteAttachmentCodec
export const deloadFile = async (attachment, client, RemoteAttachmentCodec) => {
  return RemoteAttachmentCodec.load(attachment, client)
    .then((decryptedAttachment) => {
      // Create a blob URL from the decrypted attachment data
      const blob = new Blob([decryptedAttachment.data], {
        type: decryptedAttachment.mimeType,
      });
      return URL.createObjectURL(blob);
    })
    .catch((error) => {
      console.error("Failed to load and decrypt remote attachment:", error);
    });
};

export const loadFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error("Not an ArrayBuffer"));
      }
    };
    reader.readAsArrayBuffer(file);
  });
};
function isHexAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export const resolveHandle = async (handle) => {
  //If its not a string handle and is a wallet returns the wallet
  if (isHexAddress(handle)) return handle;
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://api.everyname.xyz/forward?domain=" + handle,
    headers: {
      Accept: "application/json",
      "api-key": process.env.EVERYNAME_KEY,
    },
  };
  return axios
    .request(config)
    .then((response) => {
      return response.data.address;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};
console.log("XMTP ENV", getEnv());

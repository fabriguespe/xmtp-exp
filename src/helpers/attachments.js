import {
  AttachmentCodec,
  RemoteAttachmentCodec,
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
} from "xmtp-content-type-remote-attachment";

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

// This method receives the message.content as attachment, the xmtp client and the RemoteAttachmentCodec
export const deloadFile = async (attachment, client) => {
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

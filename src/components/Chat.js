import { useStorageUpload } from "@thirdweb-dev/react";
import React, { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { deloadFile, encodeRemoteAttachment } from "@/helpers/attachments";
import styles from "./Chat.module.css";

import {
  AttachmentCodec,
  RemoteAttachmentCodec,
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
} from "xmtp-content-type-remote-attachment";

function Chat({ client, messageHistory, conversation }) {
  const address = useAddress();
  const { mutateAsync: upload } = useStorageUpload();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState(false);

  // Function to handle sending a message
  const handleSend = async () => {
    if (inputValue) {
      if (image) {
        if (image.size > 1024 * 1024) {
          //If its larger than 1MB, handle it as RemoteAttachment
          await handleLargeFile(image);
        } else {
          //If its smaller than 1MB, handle it as Attachment
          await handleSmallFile(image);
        }
      } else {
        // Handle text input
        await onSendMessage(inputValue);
      }
      setImage(false);
      setIsLoading(false);
      setInputValue("");
    }
  };

  // Function to handle sending a small file attachment
  const handleSmallFile = async (file) => {
    // Convert the file to a Uint8Array
    const blob = new Blob([file], { type: file.type });
    let imgArray = new Uint8Array(await blob.arrayBuffer());

    const attachment = {
      filename: file.name,
      mimeType: file.type,
      data: imgArray,
    };
    await conversation.send(attachment, { contentType: ContentTypeAttachment });
  };

  const handleLargeFile = async (file) => {
    setIsLoading(true);
    setLoadingText("Encrypting...");
    const remoteAttachment = await encodeRemoteAttachment(file);
    setLoadingText("Sending...");

    const message = await conversation.send(
      remoteAttachment.attachment,
      remoteAttachment.options,
    );
    setLoadingText("Sent! 🔥");
  };

  // Function to handle sending a text message
  const onSendMessage = async (value) => {
    return conversation.send(value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setInputValue(file.name);
    setImage(file);
  };
  // Function to handle dropping a file onto the input field
  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setInputValue(file.name);
    setImage(file);
  };
  // Function to handle input change (keypress or change event)
  const handleInputChange = (event) => {
    if (event.key === "Enter") {
      handleSend();
    } else {
      setInputValue(event.target.value);
      setImage(false); // Clear the image state when typing
    }
  };

  // Function to handle the drag-over event
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Function to handle the click event on a message
  const handleClick = (message) => {
    alert("Check the console for the message details");
    console.log(message);
  };
  // Function to render a local attachment as an image
  const objectURL = (attachment) => {
    const blob = new Blob([attachment.data], { type: attachment.mimeType });
    return (
      <img
        src={URL.createObjectURL(blob)}
        width={200}
        alt={attachment.filename}
      />
    );
  };
  const RemoteURL = ({ attachment }) => {
    const [imageURL, setImageURL] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
      const fetchImage = async () => {
        //This is just a decrpytion test
        const url = await deloadFile(attachment, client);
        if (url) setImageURL(url);
      };

      fetchImage();
    }, [attachment, retryCount]);

    return imageURL ? (
      <img src={imageURL} width={200} alt={attachment.filename} />
    ) : (
      <div>
        Decryptying... may take up to 40 seconds
        <button onClick={() => setRetryCount(retryCount + 1)}> 🔄</button>
      </div>
    );
  };

  // MessageList component to render the list of messages
  const MessageList = ({ messages }) => {
    // Filter messages by unique id
    messages = messages.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
    );

    return (
      <ul className={styles.chatContainer}>
        {messages.map((message, index) => (
          <li
            className={
              message.senderAddress === address ? styles.me : styles.you
            }
            key={message.id}
            title="Click to log this message to the console">
            {(() => {
              if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
                // Handle ContentTypeRemoteAttachment
                // Add a key prop to force a re-render when a new message is sent
                return (
                  <RemoteURL key={message.id} attachment={message.content} />
                );
              } else if (message.contentType.sameAs(ContentTypeAttachment)) {
                // Handle ContentTypeAttachment
                return objectURL(message.content);
              } else {
                // Handle other content types (e.g., text messages)
                return <span>{message.content}</span>;
              }
            })()}
            <span> ({message.sent.toLocaleTimeString()})</span>
            <span className={styles.eyes} onClick={() => handleClick(message)}>
              👀
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const triggerFileInput = () => {
    document.getElementById("image-upload").click();
  };
  return (
    <div className={styles.Chat}>
      <div className={styles.messageContainer}>
        <MessageList messages={messageHistory} />
      </div>
      <div
        className={styles.inputContainer}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}>
        {isLoading ? (
          <div className={styles.inputField}>{loadingText}</div>
        ) : image ? (
          <div className={styles.inputField}>{inputValue}</div>
        ) : (
          <input
            type="text"
            className={styles.inputField}
            onKeyPress={handleInputChange}
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Type your text here or drop an image"
          />
        )}
        <button className={styles.sendButton} onClick={triggerFileInput}>
          📤
        </button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <button className={styles.sendButton} onClick={handleSend}>
          &#128073;
        </button>
      </div>
    </div>
  );
}

export default Chat;

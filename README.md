Follow these steps to start sending image attachments to wallets within your chat app. Our sample app includes everything you need to connect to wallets with thirdweb's WalletSDK, use XMTP's remote attachments, and upload larger files to thirdweb's storage.

<!--truncate-->

### Concepts

### Thirdweb WalletSDK

The WalletSDK is a development kit that grants developers access to a comprehensive selection of wallets, ranging from custodial to MPC to smart contracts.
[Read more](https://portal.thirdweb.com/wallet)

### XMTP Content-Types

Content types are a way to describe the _type_ of _content_ a message contains on XMTP. Out of the box, XMTP's SDKs support one content type: `text`.
[Read more](https://xmtp.org/docs/dev-concepts/content-types)

### Thirdweb storage

StorageSDK handles the complexities of decentralized file management for you. No need to worry about fetching from multiple IPFS gateways, handling file and metadata upload formats, etc.
[Read more](https://portal.thirdweb.com/storage)

### Demo App

This repository demonstrates the implementation of these concepts within a simple chat app.

[GitHub repo](https://github.com/fabriguespe/xmtp-thirdweb-js)

```
git clone git@github.com:fabriguespe/xmtp-thirdweb-js.git
cd xmtp-thirdweb-js
npm run dev
```

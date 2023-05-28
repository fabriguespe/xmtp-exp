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

function isHexAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

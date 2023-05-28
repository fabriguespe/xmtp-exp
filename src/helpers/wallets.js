export const resolveWallet = (walletAddress) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://api.everyname.xyz/forward?domain=fabriguespe.cb.id",
    headers: {
      Accept: "application/json",
      "api-key": process.env.EVERYNAME_KEY,
    },
  };
  console.log(process.env.EVERYNAME_KEY);
  axios
    .request(config)
    .then((response) => {
      console.log(response.data);
      return response.data.address;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};

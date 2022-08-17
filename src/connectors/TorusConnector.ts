import Torus from "@toruslabs/torus-embed";

export const isConnected = async () =>  {
  const torusProvider = new Torus();
  await torusProvider.init({
    showTorusButton: false
  });
  let isConnected = false;
  try {
    await torusProvider.getUserInfo("");
    isConnected = true;
  } catch (e) {
    isConnected = false;
  }

  return isConnected
};

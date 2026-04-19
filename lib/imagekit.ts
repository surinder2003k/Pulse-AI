import ImageKit from "imagekit";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

// Create an instance only if keys are present
const imagekit = (publicKey && privateKey && urlEndpoint)
  ? new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    })
  : null;

export default imagekit;

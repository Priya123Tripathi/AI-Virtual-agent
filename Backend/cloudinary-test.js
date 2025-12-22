import cloudinary from "./config/cloudinary.js";

(async () => {
  try {
    const res = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      { folder: "terminal-test" }
    );

    console.log("✅ Cloudinary Upload Successful");
    console.log("Image URL:", res.secure_url);
  } catch (err) {
    console.error("❌ Cloudinary Upload Failed:", err.message);
  }
})();

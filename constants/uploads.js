const FILE_UPLOADER_CONFIG = {
  useTempFiles: true,
  tempFileDir: "/tmp/",
  debug: process.env.NODE_ENV !== "dev",
  limits: { fileSize: 50 * 1024 * 10 },
};

module.exports = {
  FILE_UPLOADER_CONFIG,
};

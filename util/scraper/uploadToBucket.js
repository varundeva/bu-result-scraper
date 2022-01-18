const B2 = require("backblaze-b2");
const fs = require("fs");

const uploadBucket = async (req, res) => {
  const b2 = new B2({
    applicationKeyId: process.env.applicationKeyId, // or accountId: 'accountId'
    applicationKey: process.env.applicationKey, // or masterApplicationKey
  });
  await b2.authorize();

  const uploadUrlRaw = await b2.getUploadUrl({
    bucketId: process.env.bucketId,
  });

  const { uploadUrl, authorizationToken } = await uploadUrlRaw.data;

  const uploadedDdata = await b2.uploadFile({
    uploadUrl: uploadUrl,
    uploadAuthToken: authorizationToken,
    fileName: "abcd.pdf",
    mime: "application/pdf",
    data: fs.readFileSync("pdfs/abcd.pdf"), // this is expecting a Buffer, not an encoded string
  });
  const downloadUrl = await getFileDownloadUrl(uploadedDdata.data.fileId);
  res.send(downloadUrl);
};

const getFileDownloadUrl = async (fileId) => {
  const nativeDownloadUrl =
    await `https://f002.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${fileId}`;
  return nativeDownloadUrl;
};

module.exports = { uploadBucket };

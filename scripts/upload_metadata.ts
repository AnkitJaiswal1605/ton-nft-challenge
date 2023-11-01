import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";

async function uploadFolderToIPFS(folderPath: string): Promise<string> {
  const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
  });

  const response = await pinata.pinFromFS(folderPath);
  return response.IpfsHash;
}

async function updateMetadataFiles(metadataFolderPath: string, imagesIpfsHash: string): Promise<void> {
  const files = readdirSync(metadataFolderPath);

  for (const filename of files) {
    const index = files.indexOf(filename);
    const filePath = path.join(metadataFolderPath, filename)
    const file = await readFile(filePath);

    const metadata = JSON.parse(file.toString());
    metadata.image =
      index != files.length - 1
        ? `ipfs://${imagesIpfsHash}/${index}.jpg`
        : `ipfs://${imagesIpfsHash}/logo.jpg`;

    await writeFile(filePath, JSON.stringify(metadata));
  }
}

export async function run() {
    const metadataFolderPath = "./data/metadata/";
    const imagesFolderPath = "./data/images/";

    console.log("Started uploading images to IPFS...");
    const imagesIpfsHash = await uploadFolderToIPFS(imagesFolderPath);
    console.log(
      `Successfully uploaded the pictures to ipfs: https://gateway.pinata.cloud/ipfs/${imagesIpfsHash}`
    );

    console.log("Started uploading metadata files to IPFS...");
    await updateMetadataFiles(metadataFolderPath, imagesIpfsHash);
    const metadataIpfsHash = await uploadFolderToIPFS(metadataFolderPath);
    console.log(
      `Successfully uploaded the metadata to ipfs: https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
    );
  }

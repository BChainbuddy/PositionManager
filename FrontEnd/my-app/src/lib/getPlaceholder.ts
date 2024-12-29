import { getPlaiceholder } from "plaiceholder";
import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "..", "data", "tokenImages.json");
const rawJson = fs.readFileSync(filePath, "utf-8");
const tokenData = JSON.parse(rawJson);

export default async function generatePlaceholders() {
  console.log(tokenData);
  for (const [address, entry] of Object.entries(tokenData)) {
    if (typeof entry === "string") {
      tokenData[address] = {
        image: entry,
        placeholder: "",
      };
    }

    const { image, placeholder } = tokenData[address];

    if (!placeholder) {
      try {
        console.log(`Generating placeholder for ${address} (${image})`);
        const buffer = await fetch(image).then((res) => res.arrayBuffer());
        const { base64 } = await getPlaiceholder(Buffer.from(buffer), {
          size: 10,
        });

        tokenData[address].placeholder = base64;
      } catch (error) {
        console.error(`Error generating placeholder for ${address}:`, error);
      }
    } else {
      console.log(`Skipping ${address}, placeholder already exists.`);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(tokenData, null, 2));
  console.log("Successfully updated tokenImages.json with placeholders!");
}

generatePlaceholders().catch((err) => {
  console.error("Error in generatePlaceholders:", err);
  process.exit(1);
});

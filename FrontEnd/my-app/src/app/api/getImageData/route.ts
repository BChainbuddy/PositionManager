import { getImage } from "@/lib/getImage";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imgSrc = searchParams.get("imgSrc");
  if (!imgSrc) {
    return NextResponse.json(
      { error: "Image source is required" },
      { status: 400 }
    );
  }
  try {
    const imageData = await getImage(imgSrc);
    return NextResponse.json(imageData);
  } catch (error) {
    console.error("Error fetching image data:", error);
    return NextResponse.json(
      { error: "Failed to fetch image data" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MediaLibrary from "@/models/MediaLibrary";
import ActivityLog from "@/models/ActivityLog";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cookies } from "next/headers";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(request) {
  try {
    // 1. Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 2. Parse Multipart form
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder")?.toString() || "shivshakti";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Security check: File size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit." },
        { status: 400 }
      );
    }

    // Security check: File type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Only standard images and PDFs are allowed." },
        { status: 400 }
      );
    }

    // 3. Convert File to ArrayBuffer and then Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, file.name, folder);

    // 5. Store in MongoDB
    const mediaItem = await MediaLibrary.create({
      fileName: file.name,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: file.type.startsWith("image/") ? "image" : "pdf",
      fileSize: file.size,
      folder: folder,
    });

    await ActivityLog.create({
      action: "media_upload",
      details: `Uploaded file: ${file.name} to Cloudinary. URL: ${uploadResult.secure_url}`,
    });

    return NextResponse.json({ success: true, data: mediaItem });
  } catch (error) {
    console.error("API Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

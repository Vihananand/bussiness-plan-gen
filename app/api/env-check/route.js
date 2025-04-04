import { NextResponse } from "next/server";

export async function GET() {
  try {
    const envStatus = {
      GOOGLE_API_KEY: {
        exists: !!process.env.GOOGLE_API_KEY,
        length: process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.length : 0,
        preview: process.env.GOOGLE_API_KEY 
          ? `${process.env.GOOGLE_API_KEY.substring(0, 3)}...${process.env.GOOGLE_API_KEY.substring(process.env.GOOGLE_API_KEY.length - 3)}`
          : null
      },
      HF_API_KEY: {
        exists: !!process.env.HF_API_KEY,
        length: process.env.HF_API_KEY ? process.env.HF_API_KEY.length : 0
      }
    };

    return NextResponse.json({ 
      status: "Environment check completed",
      variables: envStatus,
      node_env: process.env.NODE_ENV || "not set"
    });
  } catch (error) {
    console.error("Error checking environment variables:", error);
    return NextResponse.json({ 
      error: "Failed to check environment", 
      message: error.message 
    }, { status: 500 });
  }
} 
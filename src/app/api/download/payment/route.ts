import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import { getSignedUserIdOrReturn } from "@/lib/auth";

export async function GET(request: Request) {
  let userId = "";
  const result = await getSignedUserIdOrReturn();
  if (!result.ok) {
    return new NextResponse(
      JSON.stringify({
        message: "Proszę się zalogować",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else {
    userId = result.userId;
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const companyId = searchParams.get("companyId");
  const paymentId = searchParams.get("paymentId");
  const fileName = searchParams.get("fileName");

  if (
    !paymentId ||
    paymentId.length > 25 ||
    !companyId ||
    companyId.length > 25 ||
    !projectId ||
    projectId.length > 25 ||
    !fileName
  ) {
    return new NextResponse(
      JSON.stringify({
        message: "Brak parametrów!",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const filePath = path.join(
    process.cwd(),
    "uploads",
    userId,
    projectId,
    companyId,
    paymentId,
    fileName
  );

  if (!fs.existsSync(filePath)) {
    return new NextResponse(
      JSON.stringify({
        message: "Nie ma takiego pliku",
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else {
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
    });
  }
}

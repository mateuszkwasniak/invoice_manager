import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSignedUserIdOrReturn } from "@/lib/auth";

export async function GET(request: NextRequest) {
  let userId = "";
  const result = await getSignedUserIdOrReturn();
  if (result.ok) {
    userId = result.userId;
  } else {
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
  }

  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("pid");

  if (!projectId || projectId?.length > 25) {
    return new NextResponse("Niepoprawne id firmy", { status: 401 });
  }

  try {
    const projectCompanies = await prisma.company.findMany({
      where: {
        userId,
        projectId,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        companies: projectCompanies,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "Nie udało się probrać firm, proszę spróbować później",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

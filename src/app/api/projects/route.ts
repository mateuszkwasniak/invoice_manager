import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSignedUserIdOrReturn } from "@/lib/auth";

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const projectId = searchParams?.get("pid");

  if (projectId && projectId.length > 25) {
    return new NextResponse("Niepoprawne id projektu", { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        userId,
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

    let companies: {
      id: string;
      name: string;
      slug: string;
    }[] = [];

    let existingProjectId = null;

    if (projectId) {
      existingProjectId = projects.find(
        (project) => project.id === projectId
      )?.id;
    }

    if (projects.length) {
      companies = await prisma.company.findMany({
        where: {
          userId,
          projectId: existingProjectId ? existingProjectId : projects[0].id,
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
    }

    return new NextResponse(
      JSON.stringify({
        projects,
        companies,
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
        message: "Nie udało się probrać firm i projektów",
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

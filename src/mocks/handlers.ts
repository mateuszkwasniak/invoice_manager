import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/test-api/companies", ({ request }) => {
    const pid = new URL(request.url).searchParams?.get("pid");

    if (!pid || pid?.length > 25) {
      return new HttpResponse("Niepoprawne id firmy", { status: 401 });
    }

    return HttpResponse.json({
      companies: [
        { id: "1", name: "Test1", slug: "test-1" },
        { id: "2", name: "Test2", slug: "test-2" },
        { id: "3", name: "Test3", slug: "test-3" },
      ],
    });
  }),
];

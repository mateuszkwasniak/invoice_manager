import { fireEvent, render, screen } from "@testing-library/react";

import PaymentsTable from "@/components/tables/payments-table/PaymentsTable";
import { PaymentsTableRowData } from "@/schemas/Payment";
import { Decimal } from "@prisma/client/runtime/library";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: () => null,
  })),
  usePathname: jest.fn(),
}));

const mockedPayments: PaymentsTableRowData[] = [
  {
    id: "1",
    title: "Pierwsza",
    paymentDate: new Date(),
    slug: "pierwsza",
    type: "materials",
    paid: false,
    price: new Decimal(100),
    company: {
      slug: "test-company",
      project: {
        slug: "test-project",
      },
    },
  },
  {
    id: "2",
    title: "Druga",
    paymentDate: new Date(),
    slug: "druga",
    type: "materials",
    paid: false,
    price: new Decimal(200),
    company: {
      slug: "test-company",
      project: {
        slug: "test-project",
      },
    },
  },
];

describe("PaymentsTable", () => {
  it("should render a table with correct number of payments", () => {
    render(
      <PaymentsTable
        payments={mockedPayments}
        page={1}
        pageCount={1}
        searchParams={{}}
      />
    );

    const tableRows = screen.getAllByTestId("payment-row");
    expect(tableRows.length).toBe(mockedPayments.length);
  });
});

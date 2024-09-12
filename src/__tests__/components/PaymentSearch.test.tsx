import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentSearch from "@/components/forms/PaymentSearch";

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(global, "setTimeout");
});
afterEach(() => {
  jest.useRealTimers();
});

const mockURLReplace = jest.fn((path: string) => null);

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    replace: mockURLReplace,
  })),
  useSearchParams: jest.fn(() => ({
    get: () => null,
    entries: () => [],
  })),
  usePathname: jest.fn(() => "/"),
}));

describe("PaymentSearch", () => {
  describe("render", () => {
    it("should render search input", () => {
      render(<PaymentSearch />);

      expect(
        screen.getByPlaceholderText("Wyszukaj płatność...")
      ).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should allow the user to input a search text", async () => {
      render(<PaymentSearch />);

      const input = screen.getByPlaceholderText("Wyszukaj płatność...");

      await userEvent
        .setup({ advanceTimers: jest.advanceTimersByTime })
        .type(input, "test");

      expect(input).toHaveValue("test");
    });
  });

  it("should change url params after delay once search input has changed", async () => {
    render(<PaymentSearch />);

    const input = screen.getByPlaceholderText("Wyszukaj płatność...");

    await userEvent
      .setup({ advanceTimers: jest.advanceTimersByTime })
      .type(input, "test");

    expect(mockURLReplace).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(mockURLReplace).toHaveBeenCalledWith("/?query=test");
  });
});

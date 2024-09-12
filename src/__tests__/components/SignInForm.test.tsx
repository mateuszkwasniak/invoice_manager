import { fireEvent, render, screen } from "@testing-library/react";
import SignInForm from "@/components/forms/SignInForm";
import { useRouter } from "next/navigation";

jest.mock("@/actions/actions", () => ({
  signUserIn: jest.fn(async (providerId: string, password: string) => {
    return {
      ok: true,
      message: "Zalogowany",
    };
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignInForm", () => {
  it("should render a form", () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    //arrange
    render(<SignInForm />);
    //action
    const form = screen.getByTestId("sign-in-form");
    //assert
    expect(form).toBeInTheDocument();
  });

  it("should show an error message if login is not provided", async () => {
    render(<SignInForm />);

    const signInButton = screen.getByRole("button");
    fireEvent.click(signInButton);

    const loginErrorMessageParagraph = await screen.findByTestId("login-error");

    expect(loginErrorMessageParagraph).toHaveTextContent(
      "Nazwa użytkownika jest wymagana"
    );
  });

  it("should show an error message if login is too long", async () => {
    render(<SignInForm />);

    const loginInput = screen.getByPlaceholderText("Jan Kowalski");

    fireEvent.change(loginInput, {
      target: { value: new Array(256).fill("a").join("") },
    });

    const signInButton = screen.getByRole("button");
    fireEvent.click(signInButton);

    const loginErrorMessageParagraph = await screen.findByTestId("login-error");

    expect(loginErrorMessageParagraph).toHaveTextContent(
      "Nazwa użytkownika składa się maksymalnie z 255 znaków"
    );
  });

  it("should show an error message if password is not provided", async () => {
    render(<SignInForm />);

    const signInButton = screen.getByRole("button");
    fireEvent.click(signInButton);

    const pwdErrorMessageParagraph = await screen.findByTestId("pwd-error");

    expect(pwdErrorMessageParagraph).toHaveTextContent("Hasło jest wymagane");
  });

  it("should show an error message if the password is too short", async () => {
    render(<SignInForm />);
    const passwordInput = screen.getByPlaceholderText("********");

    fireEvent.change(passwordInput, {
      target: { value: new Array(7).fill("a").join("") },
    });

    const signInButton = screen.getByRole("button");
    fireEvent.click(signInButton);

    const pwdErrorMessageParagraph = await screen.findByTestId("pwd-error");

    expect(pwdErrorMessageParagraph).toHaveTextContent("Zbyt krótkie hasło");
  });

  it("should show an error message if the password is too long", async () => {
    render(<SignInForm />);
    const passwordInput = screen.getByPlaceholderText("********");

    fireEvent.change(passwordInput, {
      target: { value: new Array(33).fill("a").join("") },
    });

    const signInButton = screen.getByRole("button");
    fireEvent.click(signInButton);

    const pwdErrorMessageParagraph = await screen.findByTestId("pwd-error");

    expect(pwdErrorMessageParagraph).toHaveTextContent("Zbyt długie hasło");
  });
});

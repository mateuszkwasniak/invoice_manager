import { z } from "zod";

export const SignUpFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Minimalna długośc imienia to 1 znak." })
      .max(255, { message: "Maksymalna długość imienia to 255 znaków." }),
    email: z
      .string()
      .email({ message: "Proszę wprowadzić poprawny adres mailowy" }),
    password: z
      .string()
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/, {
        message:
          "Hasło powinno składać się z przynajmniej jednej wielkiej litery, małej litery, cyfry oraz znaku specjalnego. Długość 8 do 20 znaków.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Podane hasła różnią się.",
    path: ["confirmPassword"],
  });

export type SignUpFormInput = z.infer<typeof SignUpFormSchema>;

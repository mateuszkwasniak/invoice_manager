import z from "zod";

export const SignInFormSchema = z.object({
  name: z
    .string({ required_error: "Nazwa użytkownika jest wymagana" })
    .min(1, "Nazwa użytkownika musi zawierać przynajmniej jeden znak")
    .max(255, "Nazwa użytkownika składa się maksymalnie z 255 znaków"),
  password: z
    .string({ required_error: "Hasło jest wymagane" })
    .min(1, "Hasło jest wymagane")
    .min(8, "Zbyt krótkie hasło")
    .max(32, "Zbyt długie hasło"),
});

export type SignInFormInput = z.infer<typeof SignInFormSchema>;

"use server";

import {
  PaymentFormInput,
  PaymentFormSchema,
  PaymentUpdateFormInput,
  PaymentUpdateFormSchema,
} from "@/schemas/Payment";
import prisma from "@/lib/db";
import { $Enums, Prisma } from "@prisma/client";
import { generateSlug } from "@/lib/utils/slug";
import {
  saveCompanyFiles,
  savePaymentFiles,
  validateFiles,
  validateFilesCount,
  validateUpdatedFiles,
} from "@/lib/utils/files_server";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { ProjectFormInput, ProjectFormSchema } from "@/schemas/Project";
import {
  CompanyBudgetFormInput,
  CompanyBudgetFormSchema,
  ProjectCompanyFormInput,
  ProjectCompanyFormSchema,
  CompanyUpdateFormInput,
  CompanyUpdateFormSchema,
} from "@/schemas/Company";
import { signIn, signOut } from "../auth";
import { hashPassword } from "@/lib/utils/bcrypt";
import { SignUpFormInput, SignUpFormSchema } from "@/schemas/SignUp";
import { auth } from "../auth";
import {
  convertNumberToPrice,
  convertPriceStringToNumber,
} from "@/lib/utils/numbers";

export type ActionResponse<T> = {
  ok: boolean;
  message: string;
  data?: T;
};

const convertBudgetValuesAndFilter = (
  budgets: { type: $Enums.PaymentType; value: string }[]
): { value: number; type: $Enums.PaymentType }[] => {
  return budgets
    .map((budget) => ({
      ...budget,
      value: convertPriceStringToNumber(budget.value),
    }))
    .filter((budget) => budget.value > 0);
};

const getSignedUserIdOrReturn = async (): Promise<{
  ok: boolean;
  message: string;
  data: string;
}> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        ok: false,
        message: "Proszę się zalogować",
        data: "",
      };
    }
    return {
      ok: true,
      message: "Użytkownik zalogowany",
      data: session.user.id,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        "Nie udało się zweryfikować stanu sesji, proszę spróbować później",
      data: "",
    };
  }
};

export const signUserIn = async (
  providerId: string,
  data: {
    name: string;
    password: string;
  }
): Promise<ActionResponse<null> | void> => {
  try {
    await signIn(providerId, {
      ...data,
      redirect: false,
    });

    return {
      ok: true,
      message: "Zalogowany",
    };
  } catch (error: any) {
    if (error?.type === "CallbackRouteError") {
      return {
        ok: false,
        message:
          error?.cause?.err?.message ||
          error?.message ||
          "Nie udało się zalogować, proszę spróbować później",
      };
    }
    return {
      ok: false,
      message:
        error?.message || "Nie udało się zalogować, proszę spróbować później",
    };
  }
};

export const signUserOut = async () => {
  await signOut();
};

export const signUserUp = async (
  signUpFormInput: SignUpFormInput
): Promise<ActionResponse<null>> => {
  const validation = SignUpFormSchema.safeParse(signUpFormInput);

  if (validation.success) {
    try {
      const hashedPwd = await hashPassword(signUpFormInput.password);

      const user = await prisma.user.create({
        data: {
          email: signUpFormInput.email,
          name: signUpFormInput.name,
          password: hashedPwd,
        },
      });

      await signIn("credentials", {
        name: user.name,
        password: signUpFormInput.password,
        redirect: false,
      });

      return {
        ok: true,
        message: "Zarejestrowano poprawnie",
      };
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            ok: false,
            message: "Użytkownik istnieje już w systemie.",
          };
        }
      }
      return {
        ok: false,
        message: "Nie udało się zarejestrować, proszę spróbować później",
      };
    }
  } else {
    return {
      ok: false,
      message: "Nieprawidłowe dane formularza",
    };
  }
};

export const createPayment = async (
  paymentFormInput: PaymentFormInput,
  filesFormData: FormData | null
): Promise<ActionResponse<null>> => {
  let userId: string = "";

  const auth = await getSignedUserIdOrReturn();
  if (!auth.ok) {
    return {
      ok: auth.ok,
      message: auth.message,
    };
  } else {
    userId = auth.data;
  }

  const validation = PaymentFormSchema.safeParse(paymentFormInput);

  if (validation.success) {
    try {
      const existingCompany = await prisma.company.findUnique({
        where: {
          id: paymentFormInput.companyId,
          userId,
          projectId: paymentFormInput.projectId,
        },
      });

      if (!existingCompany) {
        return {
          ok: false,
          message:
            "Firma lub projekt nie istnieją lub nie zostały utworzone przez Ciebie.",
        };
      }

      const files = filesFormData?.getAll("files");

      let fileNames: string[] = [];
      let paymentId: string = createId();

      if (files && files.length > 0) {
        const validationFiles = validateFiles(files);
        if (!validationFiles.ok) {
          return validationFiles;
        } else {
          fileNames = await savePaymentFiles(
            files as File[],
            paymentFormInput.projectId,
            paymentFormInput.companyId,
            paymentId,
            userId
          );
        }
      }

      const newPayment: Prisma.PaymentCreateInput = {
        id: paymentId,
        title: paymentFormInput.title,
        paymentDate: paymentFormInput.paymentDate,
        slug: generateSlug(paymentFormInput.title),
        type: paymentFormInput.type,
        details: paymentFormInput.details,
        files: fileNames,
        paid: paymentFormInput.paid,
        price: convertPriceStringToNumber(paymentFormInput.price),
        user: {
          connect: {
            id: userId,
          },
        },
        company: {
          connect: {
            userId,
            id: paymentFormInput.companyId,
          },
        },
      };

      const payment = await prisma.payment.create({ data: { ...newPayment } });
      revalidatePath("/payments");
      return {
        ok: true,
        message: `${payment.title}, ${payment.paymentDate}`,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            ok: false,
            message: "Płatność o takiej nazwie istnieje już w systemie.",
          };
        } else {
          return {
            ok: false,
            message: "Coś poszło nie tak, spróbuj dodać płatność później.",
          };
        }
      } else
        return {
          ok: false,
          message: "Coś poszło nie tak, spróbuj dodać płatność później.",
        };
    }
  } else {
    return {
      ok: false,
      message: "Niepoprawne dane!",
    };
  }
};

export const updatePayment = async (
  paymentFormInput: PaymentUpdateFormInput,
  filesFormData: FormData | null
): Promise<
  ActionResponse<{
    id: string;
    paymentDate: Date;
    title: string;
    type: $Enums.PaymentType;
    details: string;
    files: string[];
    paid: boolean;
    price: string;
    companyId: string;
    projectId: string;
  } | null>
> => {
  let userId: string = "";
  const auth = await getSignedUserIdOrReturn();
  if (!auth.ok) {
    return {
      ok: auth.ok,
      message: auth.message,
    };
  } else {
    userId = auth.data;
  }

  const validation = PaymentUpdateFormSchema.safeParse(paymentFormInput);

  if (validation.success) {
    try {
      const existingPayment = await prisma.payment.findUnique({
        where: {
          id: paymentFormInput.id,
          userId,
        },
      });

      if (!existingPayment) {
        return {
          ok: true,
          message: `Nie ma takiej płatności albo nie jest Twoja.`,
        };
      }

      const files = filesFormData?.getAll("files") || [];

      let fileNames: string[] = [];

      const filesCountValidation = validateFilesCount(
        files.length,
        paymentFormInput.files.length
      );

      if (!filesCountValidation.ok) {
        return filesCountValidation;
      }

      const updatedFilesValidation = validateUpdatedFiles(
        paymentFormInput.files,
        existingPayment.files
      );

      if (!updatedFilesValidation.ok) {
        return updatedFilesValidation;
      }

      if (files.length > 0) {
        const validationFiles = validateFiles(files);
        if (!validationFiles.ok) {
          return validationFiles;
        } else {
          fileNames = await savePaymentFiles(
            files as File[],
            paymentFormInput.projectId,
            paymentFormInput.companyId,
            paymentFormInput.id,
            userId
          );
        }
      }

      const { projectId, ...paymentFormInputRest } = paymentFormInput;

      const updatedPayment = await prisma.payment.update({
        where: {
          id: paymentFormInput.id,
          userId,
        },
        data: {
          ...paymentFormInputRest,
          price: paymentFormInput.price
            .replaceAll(",", ".")
            .replace(/\s/g, "")
            .trim(),
          slug: generateSlug(paymentFormInput.title),
          files: [...paymentFormInput.files, ...fileNames],
        },
      });

      revalidatePath(`/payments`, "layout");

      return {
        ok: true,
        message: updatedPayment.slug,
        data: {
          ...updatedPayment,
          projectId,
          details: updatedPayment?.details || "",
          price: convertNumberToPrice(updatedPayment.price.toNumber()),
        },
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: "Coś poszło nie tak, spróbuj edytować płatność później.",
      };
    }
  } else {
    return {
      ok: false,
      message: "Niepoprawne dane!",
    };
  }
};

export const updateCompany = async (
  companyFormInput: CompanyUpdateFormInput,
  filesFormData: FormData | null
): Promise<
  ActionResponse<{
    id: string;
    companyName: string;
    startDate: Date;
    endDate: Date | null;
    details: string;
    files: string[];
    budgets: {
      id: string;
      type: $Enums.PaymentType;
      value: number;
    }[];
  } | null>
> => {
  let userId: string = "";
  const auth = await getSignedUserIdOrReturn();
  if (!auth.ok) {
    return {
      ok: auth.ok,
      message: auth.message,
    };
  } else {
    userId = auth.data;
  }

  const validation = CompanyUpdateFormSchema.safeParse(companyFormInput);

  if (validation.success) {
    try {
      const existingCompany = await prisma.company.findUnique({
        where: {
          id: companyFormInput.id,
          userId,
        },
      });

      if (!existingCompany) {
        return {
          ok: true,
          message: `Nie ma takiej firmy albo nie została utworzona przez Ciebie.`,
        };
      }

      const files = filesFormData?.getAll("files") || [];

      let fileNames: string[] = [];

      const filesCountValidation = validateFilesCount(
        files.length,
        companyFormInput.files.length
      );

      if (!filesCountValidation.ok) {
        return filesCountValidation;
      }

      const updatedFilesValidation = validateUpdatedFiles(
        companyFormInput.files,
        existingCompany.files
      );

      if (!updatedFilesValidation.ok) {
        return updatedFilesValidation;
      }

      if (files.length > 0) {
        const validationFiles = validateFiles(files);
        if (!validationFiles.ok) {
          return validationFiles;
        } else {
          fileNames = await saveCompanyFiles(
            files as File[],
            userId,
            existingCompany.projectId,
            existingCompany.id
          );
        }
      }

      const { companyName, budgets, ...companyFormInputRest } =
        companyFormInput;

      const convertedBudgets = budgets.map((budget) => ({
        ...budget,
        value: convertPriceStringToNumber(budget.value),
      }));

      const [updatedCompany, ...updatedBudgets] = await prisma.$transaction([
        prisma.company.update({
          where: {
            id: companyFormInput.id,
            userId,
          },
          data: {
            ...companyFormInputRest,
            name: companyFormInput.companyName,
            slug: generateSlug(companyFormInput.companyName),
            files: [...companyFormInput.files, ...fileNames],
          },
        }),
        ...convertedBudgets.map((budget) =>
          prisma.budget.upsert({
            where: {
              companyId_type: {
                companyId: companyFormInput.id,
                type: budget.type,
              },
            },
            update: {
              value: budget.value,
            },
            create: {
              companyId: companyFormInput.id,
              ...budget,
            },
          })
        ),
      ]);

      revalidatePath("/", "layout");

      return {
        ok: true,
        message: updatedCompany.slug,
        data: {
          ...updatedCompany,
          companyName: updatedCompany.name,
          details: updatedCompany?.details || "",
          budgets: [
            ...updatedBudgets.map((budget) => ({
              ...budget,
              value: budget.value.toNumber(),
            })),
          ],
        },
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: "Coś poszło nie tak, spróbuj edytować projekt później.",
      };
    }
  } else {
    return {
      ok: false,
      message: "Niepoprawne dane!",
    };
  }
};

export const deletePayment = async (
  id: string
): Promise<ActionResponse<null>> => {
  let userId: string = "";
  const auth = await getSignedUserIdOrReturn();
  if (!auth.ok) {
    return {
      ok: auth.ok,
      message: auth.message,
    };
  } else {
    userId = auth.data;
  }
  try {
    const result = await prisma.payment.delete({
      where: { id, userId },
    });

    revalidatePath("/", "layout");

    return {
      ok: true,
      message: "Płatność została usunięta",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Nie udało się usunąć płatności",
    };
  }
};

export const createProject = async (
  projectFormInput: ProjectFormInput
): Promise<
  ActionResponse<{
    id: string;
    name: string;
    slug: string;
  }>
> => {
  let userId: string = "";
  const auth = await getSignedUserIdOrReturn();
  if (!auth.ok) {
    return {
      ok: auth.ok,
      message: auth.message,
    };
  } else {
    userId = auth.data;
  }

  const validation = ProjectFormSchema.safeParse(projectFormInput);

  if (validation.success) {
    try {
      const project = await prisma.project.create({
        data: {
          name: projectFormInput.projectName,
          slug: generateSlug(projectFormInput.projectName),
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return {
        ok: true,
        message: `${project.id}`,
        data: {
          id: project.id,
          name: project.name,
          slug: project.slug,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            ok: false,
            message: "Utworzyłeś już projekt o takiej nazwie.",
          };
        } else {
          return {
            ok: false,
            message: "Coś poszło nie tak, spróbuj utworzyć projekt później.",
          };
        }
      } else {
        return {
          ok: false,
          message: "Coś poszło nie tak, spróbuj utworzyć projekt później.",
        };
      }
    }
  } else {
    return {
      ok: false,
      message: "Niepoprawne dane!",
    };
  }
};

export const deleteProject = async (projectId: string) => {
  let userId: string = "";
  const auth = await getSignedUserIdOrReturn();
  if (!auth.ok) {
    return {
      ok: auth.ok,
      message: auth.message,
    };
  } else {
    userId = auth.data;
  }

  if (!projectId || projectId?.length > 25) {
    return {
      ok: false,
      message: "Brak lub niepoprawne id projektu",
    };
  }

  try {
    await prisma.project.delete({
      where: {
        userId,
        id: projectId,
      },
    });
    revalidatePath("/(dashboard)", "layout");
    return {
      ok: true,
      message: `${projectId}`,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Coś poszło nie tak, spróbuj usunąc projekt później.",
    };
  }
};

export const createCompany = async (
  companyFormInput: CompanyBudgetFormInput,
  projectId: string,
  filesFormData: FormData | null
): Promise<ActionResponse<null>> => {
  let userId: string = "";
  const auth = await getSignedUserIdOrReturn();
  if (!auth.ok) {
    return {
      ok: auth.ok,
      message: auth.message,
    };
  } else {
    userId = auth.data;
  }

  if (!projectId || projectId?.length > 25) {
    return {
      ok: false,
      message: "Brak lub niepoprawne id projektu",
    };
  }

  const validation = CompanyBudgetFormSchema.safeParse(companyFormInput);

  if (validation.success) {
    try {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: projectId,
          userId,
        },
      });

      if (!existingProject) {
        return {
          ok: false,
          message: "Projekt nie istnieje lub nie należy do Ciebie.",
        };
      }

      const files = filesFormData?.getAll("files");

      let fileNames: string[] = [];
      const newCompanyId: string = createId();

      if (files && files?.length) {
        const validationFiles = validateFiles(files);
        if (!validationFiles.ok) {
          return validationFiles;
        } else {
          fileNames = await saveCompanyFiles(
            files as File[],
            userId,
            projectId,
            newCompanyId
          );
        }
      }

      const filteredBudgets = convertBudgetValuesAndFilter(
        companyFormInput.budgets
      );
      const data = await prisma.project.update({
        where: {
          userId,
          id: projectId,
        },
        data: {
          companies: {
            create: {
              id: newCompanyId,
              name: companyFormInput.companyName,
              startDate: companyFormInput.startDate,
              endDate: companyFormInput?.endDate,
              files: fileNames,
              details: companyFormInput?.details,
              slug: generateSlug(companyFormInput.companyName),
              user: {
                connect: {
                  id: userId,
                },
              },
              budgets: {
                createMany: {
                  data: filteredBudgets,
                },
              },
            },
          },
        },
      });
      revalidatePath("/(dashboard)", "layout");
      return {
        ok: true,
        message: `${newCompanyId}`,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            ok: false,
            message: "Utworzyłeś już firmę o takiej nazwie.",
          };
        } else {
          return {
            ok: false,
            message: "Coś poszło nie tak, spróbuj utworzyć firmę później.",
          };
        }
      } else {
        return {
          ok: false,
          message: "Coś poszło nie tak, spróbuj utworzyć firmę później.",
        };
      }
    }
  } else {
    return {
      ok: false,
      message: "Niepoprawne dane!",
    };
  }
};

export const deleteCompany = async (companyId: string, projectId: string) => {
  let userId: string = "";
  const auth = await getSignedUserIdOrReturn();
  if (!auth.ok) {
    return {
      ok: auth.ok,
      message: auth.message,
    };
  } else {
    userId = auth.data;
  }
  if (
    !companyId ||
    !projectId ||
    companyId?.length > 25 ||
    projectId?.length > 25
  ) {
    return {
      ok: false,
      message: "Brak lub niepoprawne id firmy lub projektu",
    };
  }

  try {
    await prisma.company.delete({
      where: {
        userId,
        projectId,
        id: companyId,
      },
    });
    revalidatePath("/(dashboard)", "layout");
    return {
      ok: true,
      message: `${companyId}`,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Coś poszło nie tak, spróbuj usunąc firmę później.",
    };
  }
};

export const createProjectCompany = async (
  projectCompanyFormInput: ProjectCompanyFormInput,
  filesFormData: FormData | null
): Promise<ActionResponse<null>> => {
  let userId: string = "";
  const auth = await getSignedUserIdOrReturn();
  if (!auth.ok) {
    return {
      ok: auth.ok,
      message: auth.message,
    };
  } else {
    userId = auth.data;
  }
  const validation = ProjectCompanyFormSchema.safeParse(
    projectCompanyFormInput
  );

  if (validation.success) {
    try {
      const files = filesFormData?.getAll("files");

      const newCompanyId: string = createId();

      const filteredBudgets = convertBudgetValuesAndFilter(
        projectCompanyFormInput.budgets
      );

      const project = await prisma.project.upsert({
        where: {
          name_userId: {
            userId,
            name: projectCompanyFormInput.projectName,
          },
        },
        update: {
          companies: {
            create: {
              id: newCompanyId,
              name: projectCompanyFormInput.companyName,
              startDate: projectCompanyFormInput.startDate,
              endDate: projectCompanyFormInput?.endDate,
              details: projectCompanyFormInput.details,
              slug: generateSlug(projectCompanyFormInput.companyName),
              user: {
                connect: {
                  id: userId,
                },
              },
              budgets: {
                createMany: {
                  data: filteredBudgets,
                },
              },
            },
          },
        },
        create: {
          name: projectCompanyFormInput.projectName,
          slug: generateSlug(projectCompanyFormInput.projectName),
          user: {
            connect: {
              id: userId,
            },
          },
          companies: {
            create: {
              id: newCompanyId,
              name: projectCompanyFormInput.companyName,
              startDate: projectCompanyFormInput.startDate,
              endDate: projectCompanyFormInput?.endDate,
              details: projectCompanyFormInput.details,
              slug: generateSlug(projectCompanyFormInput.companyName),
              user: {
                connect: {
                  id: userId,
                },
              },
              budgets: {
                createMany: {
                  data: filteredBudgets,
                },
              },
            },
          },
        },
      });

      if (files && files?.length) {
        const validationFiles = validateFiles(files);
        if (!validationFiles.ok) {
          return validationFiles;
        }

        const fileNames = await saveCompanyFiles(
          files as File[],
          userId,
          project.id,
          newCompanyId
        );

        await prisma.company.update({
          where: {
            id: newCompanyId,
          },
          data: {
            files: fileNames,
          },
        });
      }

      return {
        ok: true,
        message: `${project.id}, ${projectCompanyFormInput.projectName}`,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: "Coś poszło nie tak, spróbuj dodać firmę i projekt później.",
      };
    }
  } else {
    return {
      ok: false,
      message: "Niepoprawne dane!",
    };
  }
};

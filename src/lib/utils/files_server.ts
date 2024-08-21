import { ActionResponse } from "@/actions/actions";
import path from "path";
import { promises as fs } from "fs";

const allowedFiles = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "text/plain",
  "application/pdf",
];

export const validateFilesCount = (
  newFilesCount: number,
  updatedFilesCount: number
) => {
  if (newFilesCount + updatedFilesCount > 15) {
    return {
      ok: false,
      message: "W formularzu zostały przesłane nieprawidłowe pliki.",
    };
  }

  return {
    ok: true,
    message: "Pliki prawidłowe",
  };
};

export const validateUpdatedFiles = (
  updatedFiles: string[],
  alreadyUploadedFiles: string[]
) => {
  if (alreadyUploadedFiles.length < updatedFiles.length) {
    return {
      ok: false,
      message: "W formularzu zostały przesłane nieprawidłowe pliki.",
    };
  }
  for (const fileName of updatedFiles) {
    if (!alreadyUploadedFiles.includes(fileName)) {
      return {
        ok: false,
        message: "W formularzu zostały przesłane nieprawidłowe pliki.",
      };
    }
  }

  return {
    ok: true,
    message: "Pliki prawidłowe",
  };
};

export const validateFiles = (
  files: FormDataEntryValue[]
): ActionResponse<null> => {
  if (files.length > 15) {
    return { ok: false, message: "Maksymalna liczba plików to 15." };
  } else {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!(file instanceof File)) {
        return {
          ok: false,
          message: "W formularzu zostały przesłane nieprawidłowe pliki.",
        };
      }
      if (file.size > 10 * 1024 * 1024) {
        return { ok: false, message: "Maksymalny rozmiar pliku to 10 MB." };
      }

      if (!allowedFiles.includes(file.type)) {
        return {
          ok: false,
          message:
            "Dozwolone są wyłącznie pliki: jpg, jpeg, png, pdf oraz txt.",
        };
      }
    }

    return { ok: true, message: "Pliki poprawne" };
  }
};

export const saveCompanyFiles = async (
  files: File[],
  userId: string,
  projectId: string,
  companyId: string
): Promise<string[]> => {
  let fileNames: string[] = [];

  const uploadDir = path.join(
    process.cwd(),
    "uploads",
    userId,
    projectId,
    companyId
  );

  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  for (let file of files) {
    const fileName = Buffer.from(file.name, "latin1").toString("utf8");
    const filePath = path.join(uploadDir, fileName);

    const fileData = await file.arrayBuffer();

    await fs.writeFile(filePath, Buffer.from(fileData));
    fileNames.push(fileName);
  }

  return fileNames;
};

export const savePaymentFiles = async (
  files: File[],
  projectId: string,
  companyId: string,
  paymentId: string,
  userId: string
): Promise<string[]> => {
  let fileNames: string[] = [];

  const uploadDir = path.join(
    process.cwd(),
    "uploads",
    userId,
    projectId,
    companyId,
    paymentId
  );

  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  for (let file of files) {
    const fileName = Buffer.from(file.name, "latin1").toString("utf8");
    const filePath = path.join(uploadDir, fileName);

    const fileData = await file.arrayBuffer();

    await fs.writeFile(filePath, Buffer.from(fileData));
    fileNames.push(fileName);
  }

  return fileNames;
};

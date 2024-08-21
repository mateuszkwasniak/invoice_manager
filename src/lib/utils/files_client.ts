const allowedFiles = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "text/plain",
  "application/pdf",
];

export const validateUploadedFiles = (
  filesList: FileList,
  files: File[],
  alreadyUploaded: number,
): { ok: boolean; error: string } => {
  if (files.length + filesList.length + alreadyUploaded > 20) {
    return { ok: false, error: "Maksymalna liczba plików to 20." };
  } else {
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      if (file.size > 50 * 1024 * 1024) {
        return { ok: false, error: "Maksymalny rozmiar pliku to 50 MB." };
      }

      if (!allowedFiles.includes(file.type)) {
        return {
          ok: false,
          error: "Dozwolone są wyłącznie pliki: jpg, jpeg, png, pdf oraz txt.",
        };
      }
    }

    return { ok: true, error: "" };
  }
};

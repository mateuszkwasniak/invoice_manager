import { validateUploadedFiles } from "@/lib/utils/files_client";

//mocked FileList
class MockFileList implements FileList {
  private files: File[];

  constructor(files: File[]) {
    this.files = files;

    return new Proxy(this, {
      get(target, prop) {
        if (typeof prop === "string" && !isNaN(Number(prop))) {
          return target.files[Number(prop)] || undefined;
        }
        return (target as any)[prop];
      },
    });
  }

  get length(): number {
    return this.files.length;
  }

  item(index: number): File | null {
    return this.files[index] || null;
  }

  [Symbol.iterator](): IterableIterator<File> {
    let counter = 0;
    const files = this.files;

    return {
      next(): IteratorResult<File> {
        if (counter < files.length) {
          return { value: files[counter++], done: false };
        }
        return { value: undefined, done: true };
      },
      [Symbol.iterator](): IterableIterator<File> {
        return this;
      },
    };
  }

  [index: number]: File;
}

const MAX_FILES_COUNT = 20;
const MAX_FILE_SIZE = 50;
const MAX_FILES_COUNT_RESPONSE = `Maksymalna liczba plików to ${MAX_FILES_COUNT}.`;
const MAX_FILE_SIZE_RESPONSE = `Maksymalny rozmiar pliku to ${MAX_FILE_SIZE} MB.`;
const INVALID_FILE_TYPE_RESPONSE = `Dozwolone są wyłącznie pliki: jpg, jpeg, png, pdf oraz txt.`;

const POSITIVE_RESPONSE_OBJ = {
  ok: true,
  error: "",
};

const createMockFile = (name: string, size: number, type: string): File => {
  const blob = new Blob([new Array(size).fill("a").join("")], { type });
  return new File([blob], name, { type });
};

const mockedPNG = createMockFile("mockedPNG", 10 * 1024 * 1024, "image/png");
const mockedJPEG = createMockFile("mockedJPEG", 10 * 1024 * 1024, "image/jpeg");
const mockedJPG = createMockFile("mockedJPG", 10 * 1024 * 1024, "image/jpg");
const mockedTXT = createMockFile("mockedTXT", 10 * 1024 * 1024, "text/plain");
const mockedPDF = createMockFile(
  "mockedPDF",
  10 * 1024 * 1024,
  "application/pdf"
);

const mockedPNGBig = createMockFile(
  "mockedPNGBig",
  51 * 1024 * 1024,
  "image/png"
);

test("should return ok response", () => {
  const mockedFileList = new MockFileList([mockedPNG, mockedJPEG, mockedJPG]);
  expect(
    validateUploadedFiles(mockedFileList, [mockedTXT, mockedPDF], 0)
  ).toStrictEqual(POSITIVE_RESPONSE_OBJ);
});

test("should return ok response", () => {
  const mockedFileList = new MockFileList(new Array(10).fill(mockedPNG));
  expect(
    validateUploadedFiles(mockedFileList, new Array(10).fill(mockedPNG), 0)
  ).toStrictEqual(POSITIVE_RESPONSE_OBJ);
});

test("should return not ok response", () => {
  const mockedFileList = new MockFileList([
    mockedPNG,
    mockedJPEG,
    mockedJPG,
    mockedTXT,
    mockedPDF,
  ]);
  expect(
    validateUploadedFiles(mockedFileList, new Array(16).fill(mockedPNG), 0)
  ).toStrictEqual({
    ok: false,
    error: MAX_FILES_COUNT_RESPONSE,
  });
});

test("should return not ok response", () => {
  const mockedFileList = new MockFileList([]);
  expect(
    validateUploadedFiles(mockedFileList, new Array(16).fill(mockedPNG), 5)
  ).toStrictEqual({
    ok: false,
    error: MAX_FILES_COUNT_RESPONSE,
  });
});

test("should return not ok response", () => {
  const mockedFileList = new MockFileList([mockedPNGBig]);
  expect(validateUploadedFiles(mockedFileList, [], 0)).toStrictEqual({
    ok: false,
    error: MAX_FILE_SIZE_RESPONSE,
  });
});

test("should return not ok response", () => {
  expect(
    validateUploadedFiles(
      new MockFileList([createMockFile("test", 10 * 1024 * 1024, "test/test")]),
      [],
      0
    )
  ).toStrictEqual({
    ok: false,
    error: INVALID_FILE_TYPE_RESPONSE,
  });
});

import bcrypt from "bcryptjs";
const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPwd = await bcrypt.hash(password, saltRounds);
  return hashedPwd;
};

export const comparePasswordAndHash = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

import "server-only";
import { auth } from "../auth";

export const getSignedUserIdOrReturn = async (): Promise<{
  ok: boolean;
  userId: string;
}> => {
  try {
    if (typeof window !== "undefined") {
      throw new Error("Funkcja wywolana poza serwerem");
    }
    const session = await auth();
    if (!session?.user?.id) {
      return {
        ok: false,
        userId: "",
      };
    }
    return {
      ok: true,
      userId: session.user.id,
    };
  } catch (error) {
    return {
      ok: false,
      userId: "",
    };
  }
};

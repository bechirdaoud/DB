export type SessionContext = {
  role: "client" | "admin";
  userId: string;
};

export const mockSession: SessionContext = {
  role: "admin",
  userId: "u_12345",
};

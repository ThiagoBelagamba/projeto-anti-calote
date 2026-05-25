import { api } from "./api";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "student";
  };
}

export async function login(email: string, password?: string, role: "admin" | "student" = "admin"): Promise<LoginResponse> {
  // we use password as a placeholder here, though backend supports password or password_hash
  const response = await api.post("/auth/login", { email, password, role });
  return response.data;
}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../infrastructure/database/connection";
import { env } from "../../config/env";

export interface LoginDTO {
  email: string;
  password?: string;
  password_hash?: string;
}

export class LoginUseCase {
  async execute(dto: LoginDTO) {
    const table = "users";
    const password = dto.password || dto.password_hash;
    
    if (!password) {
      throw new Error("Password is required");
    }

    const user = await db(table).where({ email: dto.email.toLowerCase() }).first();

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.password_hash) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { sub: user.id, role: "admin" },
      env.jwtSecret || "supersecret-dev-key",
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "admin",
      },
    };
  }
}

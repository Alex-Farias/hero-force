import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  exp: number;
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    return null;
  }
};

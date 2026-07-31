import client from "./client";

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const authApi = {
  sendOtp: (data: RegisterPayload) =>
    client.post("/users/auth/send-otp", data).then(response => response.data),
  verifyOtp: (otp: string) =>
    client.post("/users/auth/verify-otp", { otp }).then(response => response.data),
  login: (email: string, password: string) =>
    client.post("/users/auth/login", { email, password }).then(response => response.data),
  googleAuth: (idToken: string) =>
    client.post("/users/auth/google-auth", { idToken }).then(response => response.data),
  getProfile: () => client.get("/users/user/profile").then(response => response.data),
};

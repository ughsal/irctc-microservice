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
    client.post("/auth/send-otp", data).then(r => r.data),

  verifyOtp: (otp: string) =>
    client.post("/auth/verify-otp", { otp }).then(r => r.data),

  login: (email: string, password: string) =>
    client.post("/auth/login", { email, password }).then(r => r.data),

  googleAuth: (idToken: string) =>
    client.post("/auth/google-auth", { idToken }).then(r => r.data),

  getProfile: () => client.get("/user/profile").then(r => r.data),
};

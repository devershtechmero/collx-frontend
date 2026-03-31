"use client";

export type AuthUser = {
  email: string;
  name: string;
};

type SyncOauthUserParams = AuthUser & {
  clerkId: string;
  token: string;
};

type ProfileRequestParams = {
  email: string;
  clerkId?: string;
  token?: string;
};

type ApiEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

type RequestOtpResponse = {
  previewOtp?: string;
};

type LoginResponse = {
  user: AuthUser;
};

type VerifyForgotPasswordResponse = {
  resetToken: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:3030";

class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

async function postJson<TResponse>(
  path: string,
  body: Record<string, unknown>,
  token?: string,
  method = "POST",
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}/auth${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as ApiEnvelope<TResponse | null>;

  if (!response.ok) {
    throw new AuthApiError(payload.message || "Something went wrong.", response.status);
  }

  return (payload.data || {}) as TResponse;
}

export async function requestSignupOtp(email: string, password: string) {
  return postJson<RequestOtpResponse>("/sign-up/request-otp", { email, password });
}

export async function verifySignupOtp(email: string, otp: string) {
  return postJson<LoginResponse>("/sign-up/verify", { email, otp });
}

export async function requestLoginOtp(email: string, password: string) {
  return postJson<RequestOtpResponse>("/login/request-otp", { email, password });
}

export async function verifyLoginOtp(email: string, otp: string) {
  return postJson<LoginResponse>("/login/verify", { email, otp });
}

export async function requestForgotPasswordOtp(email: string) {
  return postJson<RequestOtpResponse>("/forgot-password/request-otp", { email });
}

export async function verifyForgotPasswordOtp(email: string, otp: string) {
  return postJson<VerifyForgotPasswordResponse>("/forgot-password/verify", {
    email,
    otp,
  });
}

export async function resetForgottenPassword(
  email: string,
  password: string,
  resetToken: string,
) {
  return postJson("/forgot-password/reset", { email, password, resetToken });
}

export async function syncOauthUser({
  email,
  name,
  clerkId,
  token,
}: SyncOauthUserParams) {
  return postJson<LoginResponse>("/oauth/sync", {
    email,
    name,
    clerkId,
  }, token);
}

export async function updateProfileName(
  params: ProfileRequestParams & { name: string },
) {
  return postJson<LoginResponse>(
    "/profile",
    {
      email: params.email,
      name: params.name,
      clerkId: params.clerkId,
    },
    params.token,
    "PATCH",
  );
}

export async function changeProfilePassword(
  params: ProfileRequestParams & {
    currentPassword: string;
    newPassword: string;
  },
) {
  return postJson(
    "/profile/password",
    {
      email: params.email,
      currentPassword: params.currentPassword,
      newPassword: params.newPassword,
    },
    params.token,
    "PATCH",
  );
}

export async function deleteProfile(params: ProfileRequestParams) {
  return postJson(
    "/profile",
    {
      email: params.email,
      clerkId: params.clerkId,
    },
    params.token,
    "DELETE",
  );
}

export { AuthApiError };

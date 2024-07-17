export const AUTH = {
    register: `/auth/register`,
    otpMatch: `/auth/otp-match`,
    forgetEmailPassword: `/auth/forget-password`,
    createNewPassword: `/auth/create-password`,
    resendOtp: `/auth/resend-otp`,
    socialLogin: `/auth/socialLogin`,
    sendEmailVerification: `/auth/email-verification`,
    matchEmailOtp: `/auth/verify-otp`,
    getUserById: (id: string) => `/auth/getUserById/${id}`,
}

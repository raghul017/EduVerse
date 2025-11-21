export const emailService = {
  async sendPasswordReset (email, token) {
    console.info(`Password reset link for ${email}: ${token}`);
    return true;
  }
};

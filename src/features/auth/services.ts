/**
 * Frontend-only stubs. No backend wired.
 * TODO: Replace with real implementations when backend is ready.
 */
export async function signIn(_email: string, _password: string) {
  throw new Error("Authentication is not enabled in this build.");
}

export async function isCurrentUserAdmin() {
  return false;
}

export async function signUp(
  _email: string,
  _password: string,
  _redirectTo: string,
): Promise<{ session: unknown | null }> {
  throw new Error("Authentication is not enabled in this build.");
}

export async function signOut() {
  // no-op
}

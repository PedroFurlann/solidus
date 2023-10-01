export function storageTokenSave(token: { token: string }) {
  localStorage.setItem('token', token.token);
}

export function storageTokenGet(): { token: string } | null {
  const token = localStorage.getItem('token');
  return token ? { token } : null;
}

export function storageTokenRemove() {
  localStorage.removeItem('token');
}
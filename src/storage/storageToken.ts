export function storageTokenSave(token: { token: string }) {
  if (typeof window !== "undefined") {
  }

  localStorage.setItem("token", token.token);
}

export function storageTokenGet(): { token: string } | null | undefined {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  }
  
}

export function storageTokenRemove() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

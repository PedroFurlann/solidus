import { UserDTO } from "@/dtos/UserDTO";

export function storageUserSave(user: UserDTO) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function storageUserGet(): UserDTO | undefined {
  if (typeof window !== "undefined") {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  }
}

export function storageUserRemove() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

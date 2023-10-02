import { UserDTO } from "@/dtos/UserDTO";

export function storageUserSave(user: UserDTO) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function storageUserGet(): UserDTO {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

export function storageUserRemove() {
  localStorage.removeItem('user');
}
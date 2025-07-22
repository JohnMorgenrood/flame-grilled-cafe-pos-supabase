import { useContext } from "react";
export function useAuth() {
  return {
    user: { displayName: "Test User", email: "test@example.com" },
    userProfile: {
      displayName: "Test User",
      email: "test@example.com",
      photoURL: "",
      address: "123 Main Street, Cape Town"
    }
  };
}

import type { Metadata } from "next";
import UserManagement from "./user-management";

export const metadata: Metadata = {
  title: "User Management | RunBox"
};

export default function AdminUsersPage() {
  return <UserManagement />;
}

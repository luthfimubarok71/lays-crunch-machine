import { AdminShell } from "@/features/admin/dashboard";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

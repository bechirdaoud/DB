import { NavItem } from "@/lib/types/navigation";

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", group: "Portal" },
  { label: "Preferences", href: "/app/preferences", group: "Portal" },
  { label: "Activity", href: "/app/activity", group: "Portal" },
  { label: "Transfer", href: "/app/transfer", group: "Portal" },
  { label: "Users", href: "/admin/users", group: "Admin" },
  { label: "User Detail", href: "/admin/users/12345", group: "Admin" },
  { label: "Audit", href: "/admin/audit", group: "Admin" },
];

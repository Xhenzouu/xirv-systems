import type { NavigationItem } from "../types/navigation"

// Base navigation items for regular users
const userNavigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "AI Intelligence",
    path: "/ai",
  },
  {
    label: "Knowledge Base",
    path: "/knowledge",
  },
  {
    label: "Workflows",
    path: "/workflows",
  },
  {
    label: "Analytics",
    path: "/analytics",
  },
  {
    label: "Settings",
    path: "/settings",
  },
]

// Admin navigation items (shown INSTEAD of regular pages for ADMIN role)
const adminNavigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/admin",
  },
  {
    label: "Members",
    path: "/admin/members",
  },
  {
    label: "Teams",
    path: "/admin/teams",
  },
  {
    label: "Settings",
    path: "/admin/settings",
  },
]

// SUPER_ADMIN navigation items
const superAdminNavigationItems: NavigationItem[] = [
  {
    label: "Super Admin",
    path: "/super-admin",
  },
  {
    label: "Users",
    path: "/super-admin/users",
  },
  {
    label: "Organizations",  // ← ADD THIS
    path: "/super-admin/organizations",
  },
  {
    label: "Audit Logs",
    path: "/super-admin/audit-logs",
  },
  {
    label: "System",
    path: "/super-admin/system",
  },
  {
    label: "Cache",
    path: "/super-admin/cache",
  },
]

export function getNavigationItems(role?: string, currentPath?: string): NavigationItem[] {
  // SUPER_ADMIN on SUPER_ADMIN pages → show only super admin items
  if (role === 'SUPER_ADMIN' && currentPath?.startsWith('/super-admin')) {
    return superAdminNavigationItems
  }

  // ADMIN → show only admin items
  if (role === 'ADMIN') {
    return adminNavigationItems
  }

  // SUPER_ADMIN on regular pages → show regular + super admin link
  if (role === 'SUPER_ADMIN') {
    return [...userNavigationItems, {
      label: "Super Admin",
      path: "/super-admin",
    }]
  }

  // Regular user → show regular pages
  return userNavigationItems
}

// Keep the old export for backward compatibility
export const navigationItems: NavigationItem[] = getNavigationItems()
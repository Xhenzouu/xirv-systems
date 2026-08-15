import type { NavigationItem } from "../types/navigation"

// Base navigation items for all authenticated users
const baseNavigationItems: NavigationItem[] = [
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

// SUPER_ADMIN navigation items (shown instead of regular items on /super-admin pages)
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
  // If user is SUPER_ADMIN and on a SUPER_ADMIN page, show only SUPER_ADMIN navigation
  if (role === 'SUPER_ADMIN' && currentPath?.startsWith('/super-admin')) {
    return superAdminNavigationItems
  }

  // If user is SUPER_ADMIN but on regular pages, show regular + super admin link
  if (role === 'SUPER_ADMIN') {
    return [...baseNavigationItems, {
      label: "Super Admin",
      path: "/super-admin",
    }]
  }

  return baseNavigationItems
}

// Keep the old export for backward compatibility
export const navigationItems: NavigationItem[] = getNavigationItems()
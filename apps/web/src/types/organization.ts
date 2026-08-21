export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  createdAt: string
  updatedAt: string
  members: OrganizationMember[]
  teams: Team[]
  settings: OrganizationSettings
  role?: string
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  joinedAt: string
  updatedAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface Team {
  id: string
  name: string
  description?: string
  organizationId: string
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: 'LEADER' | 'MEMBER'
  joinedAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface OrganizationSettings {
  id: string
  organizationId: string
  allowPublicSignup: boolean
  requireEmailVerification: boolean
  defaultRole: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
}
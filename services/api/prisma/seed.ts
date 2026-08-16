import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create SUPER_ADMIN user
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@xirv.com'
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!'

  let superAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  })

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10)
    superAdmin = await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email: superAdminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      }
    })
    console.log(`✅ SUPER_ADMIN user created: ${superAdminEmail}`)
  } else {
    console.log(`✅ SUPER_ADMIN user already exists: ${superAdmin.email}`)
  }

  // 2. Create default Organization for SUPER_ADMIN
  const defaultOrg = await prisma.organization.upsert({
    where: { slug: 'xirv-systems' },
    update: {},
    create: {
      name: 'XIRV Systems',
      slug: 'xirv-systems',
      description: 'Enterprise Intelligence Platform',
      members: {
        create: {
          userId: superAdmin.id,
          role: 'OWNER',
        }
      },
      settings: {
        create: {
          allowPublicSignup: false,
          requireEmailVerification: true,
          defaultRole: 'MEMBER',
        }
      }
    }
  })
  console.log(`✅ Default organization created: ${defaultOrg.name}`)

  // 3. Create ADMIN user
  let adminUser = await prisma.user.findFirst({
    where: { email: 'admin@xirv.com' }
  })

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10)
    adminUser = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@xirv.com',
        password: hashedPassword,
        role: 'ADMIN',
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      }
    })
    console.log('✅ ADMIN user created: admin@xirv.com')

    // Add admin to organization
    await prisma.organizationMember.create({
      data: {
        organizationId: defaultOrg.id,
        userId: adminUser.id,
        role: 'ADMIN',
      }
    })
    console.log('✅ ADMIN added to organization')
  } else {
    console.log('✅ ADMIN user already exists: admin@xirv.com')
  }

  // 4. Create regular USER
  let regularUser = await prisma.user.findFirst({
    where: { email: 'user@xirv.com' }
  })

  if (!regularUser) {
    const hashedPassword = await bcrypt.hash('User123!', 10)
    regularUser = await prisma.user.create({
      data: {
        firstName: 'Regular',
        lastName: 'User',
        email: 'user@xirv.com',
        password: hashedPassword,
        role: 'USER',
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      }
    })
    console.log('✅ Regular user created: user@xirv.com')

    // Add user to organization
    await prisma.organizationMember.create({
      data: {
        organizationId: defaultOrg.id,
        userId: regularUser.id,
        role: 'MEMBER',
      }
    })
    console.log('✅ User added to organization')
  } else {
    console.log('✅ Regular user already exists: user@xirv.com')
  }

  console.log('\n🎉 Seeding complete!')
  console.log(`📊 Organizations: 1`)
  console.log(`👥 Users: 3`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
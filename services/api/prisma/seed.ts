import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@xirv.com'
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!'

  const existing = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  })

  if (!existing) {
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10)
    await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email: superAdminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    })
    console.log('✅ SUPER_ADMIN user created')
    console.log(`   Email: ${superAdminEmail}`)
  } else {
    console.log('✅ SUPER_ADMIN user already exists')
  }

  // Also ensure at least one ADMIN exists
  const adminExists = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10)
    await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@xirv.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log('✅ ADMIN user created')
    console.log('   Email: admin@xirv.com')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
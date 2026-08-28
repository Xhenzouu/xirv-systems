const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function create() {
  try {
    const hashed = await bcrypt.hash('Admin123!', 10);
    const user = await prisma.user.create({
      data: {
        email: 'admin@xirv.com',
        password: hashed,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isEmailVerified: true
      }
    });
    console.log('✅ Admin created:', user.email);
    console.log('📝 Password: Admin123!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

create();
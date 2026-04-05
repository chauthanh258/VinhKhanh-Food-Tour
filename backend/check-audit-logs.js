const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('📋 Kiểm tra Audit Logs...\n');

  try {
    // Kiểm tra tổng số audit logs
    const totalLogs = await prisma.auditLog.count();
    console.log(`✅ Tổng Audit Logs: ${totalLogs}\n`);

    if (totalLogs === 0) {
      console.log('⚠️  Chưa có audit logs. Hãy thực hiện một hành động admin (thêm/sửa/xóa category hoặc POI)');
      console.log('📝 Đảm bảo bạn đã login với role ADMIN trước khi thực hiện hành động\n');
    } else {
      // Hiển thị 10 audit logs gần nhất
      const recentLogs = await prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              fullName: true,
              role: true,
            },
          },
        },
      });

      console.log('📋 10 Audit Logs gần nhất:\n');
      recentLogs.forEach((log, index) => {
        console.log(`${index + 1}. Action: ${log.action}`);
        console.log(`   Admin: ${log.admin?.fullName || 'N/A'} (${log.admin?.email})`);
        console.log(`   Target: ${log.targetId || 'N/A'}`);
        console.log(`   Details: ${log.details || 'N/A'}`);
        console.log(`   Time: ${log.createdAt.toLocaleString('vi-VN')}\n`);
      });
    }

    // Kiểm tra admin users
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        _count: { select: { auditLogs: true } },
      },
    });

    console.log(`👤 Admin Users: ${admins.length}`);
    admins.forEach((admin) => {
      console.log(`   - ${admin.email} (${admin.fullName}) - Logs: ${admin._count.auditLogs}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import prisma from '../utils/prisma';

export const logAdminAction = async (
  adminId: string,
  action: string,
  targetId?: string,
  details?: any
) => {
  try {
    console.log(`[AUDIT] Creating log - Action: ${action}, AdminId: ${adminId}, TargetId: ${targetId}`);
    
    const log = await prisma.auditLog.create({
      data: {
        adminId,
        action,
        targetId,
        details: details ? JSON.stringify(details) : undefined,
      },
    });
    
    console.log(`[AUDIT] Log created successfully - ID: ${log.id}`);
    return log;
  } catch (error: any) {
    console.error('[AUDIT] Failed to create audit log:', error.message);
    console.error('[AUDIT] Error details:', {
      adminId,
      action,
      targetId,
      errorCode: error.code,
      errorMeta: error.meta,
    });
    return null;
  }
};

export const getAuditLogs = async (skip: number = 0, take: number = 20) => {
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    }),
    prisma.auditLog.count(),
  ]);
  return { logs, total };
};

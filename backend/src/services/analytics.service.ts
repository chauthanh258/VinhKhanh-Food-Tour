import prisma from '../utils/prisma';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getOwnerAnalytics = async (ownerId: string) => {
  const [ownerPois, ownerMenuItems] = await Promise.all([
    prisma.pOI.findMany({
      where: { ownerId },
      select: {
        id: true,
        rating: true,
        isActive: true,
        createdAt: true,
        translations: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.menuItem.findMany({
      where: {
        poi: {
          ownerId,
        },
      },
      select: {
        id: true,
        poiId: true,
        createdAt: true,
      },
    }),
  ]);

  const totalPois = ownerPois.length;
  const totalMenuItems = ownerMenuItems.length;
  const activePois = ownerPois.filter((p) => p.isActive).length;
  const avgRating =
    totalPois > 0
      ? Number((ownerPois.reduce((acc, p) => acc + Number(p.rating || 0), 0) / totalPois).toFixed(2))
      : 0;

  const today = startOfDay(new Date());
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData: Array<{ name: string; pois: number; menuItems: number }> = [];

  for (let i = 6; i >= 0; i -= 1) {
    const dayStart = new Date(today.getTime() - i * DAY_MS);
    const dayEnd = new Date(dayStart.getTime() + DAY_MS);

    const poisCount = ownerPois.filter(
      (poi) => poi.createdAt >= dayStart && poi.createdAt < dayEnd
    ).length;

    const menuItemCount = ownerMenuItems.filter(
      (item) => item.createdAt >= dayStart && item.createdAt < dayEnd
    ).length;

    chartData.push({
      name: labels[dayStart.getDay() === 0 ? 6 : dayStart.getDay() - 1],
      pois: poisCount,
      menuItems: menuItemCount,
    });
  }

  const distributionMap = new Map<string, { name: string; value: number }>();

  ownerMenuItems.forEach((item) => {
    const poi = ownerPois.find((p) => p.id === item.poiId);
    const name = poi?.translations?.name || 'Unnamed POI';
    const existing = distributionMap.get(item.poiId);
    if (existing) {
      existing.value += 1;
    } else {
      distributionMap.set(item.poiId, { name, value: 1 });
    }
  });

  const distribution = Array.from(distributionMap.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return {
    stats: {
      totalPois,
      activePois,
      totalMenuItems,
      avgRating,
      activeRate: totalPois > 0 ? Number(((activePois / totalPois) * 100).toFixed(1)) : 0,
    },
    chartData,
    distribution,
  };
};

export const getOwnerDashboard = async (ownerId: string) => {
  const [ownerPois, ownerMenuItems, latestPois, latestMenuItems] = await Promise.all([
    prisma.pOI.findMany({
      where: { ownerId },
      select: {
        id: true,
        rating: true,
        isActive: true,
        createdAt: true,
        translations: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.menuItem.findMany({
      where: {
        poi: {
          ownerId,
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    }),
    prisma.pOI.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        translations: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.menuItem.findMany({
      where: {
        poi: {
          ownerId,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    }),
  ]);

  const totalPois = ownerPois.length;
  const activePois = ownerPois.filter((p) => p.isActive).length;
  const totalMenuItems = ownerMenuItems.length;
  const avgRating =
    totalPois > 0
      ? Number((ownerPois.reduce((acc, p) => acc + Number(p.rating || 0), 0) / totalPois).toFixed(2))
      : 0;

  const today = startOfDay(new Date());
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData: Array<{ name: string; pois: number; menuItems: number }> = [];

  for (let i = 6; i >= 0; i -= 1) {
    const dayStart = new Date(today.getTime() - i * DAY_MS);
    const dayEnd = new Date(dayStart.getTime() + DAY_MS);

    const poisCount = ownerPois.filter((poi) => poi.createdAt >= dayStart && poi.createdAt < dayEnd).length;
    const menuItemCount = ownerMenuItems.filter((item) => item.createdAt >= dayStart && item.createdAt < dayEnd).length;

    chartData.push({
      name: labels[dayStart.getDay() === 0 ? 6 : dayStart.getDay() - 1],
      pois: poisCount,
      menuItems: menuItemCount,
    });
  }

  const activities = [
    ...latestPois.map((poi) => ({
      id: `poi-${poi.id}`,
      type: 'poi',
      message: `Added POI: ${poi.translations?.name || 'Unnamed POI'}`,
      timestamp: poi.createdAt,
    })),
    ...latestMenuItems.map((item) => ({
      id: `menu-${item.id}`,
      type: 'menu',
      message: `Added menu item: ${item.name}`,
      timestamp: item.createdAt,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 6)
    .map((activity) => ({
      ...activity,
      timestamp: activity.timestamp.toISOString(),
    }));

  return {
    stats: {
      totalPois,
      activePois,
      totalMenuItems,
      avgRating,
      activeRate: totalPois > 0 ? Number(((activePois / totalPois) * 100).toFixed(1)) : 0,
    },
    chartData,
    activities,
  };
};

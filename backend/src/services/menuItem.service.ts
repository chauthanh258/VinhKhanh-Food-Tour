import * as menuItemRepo from '../repositories/menuItem.repo';
import * as poiRepo from '../repositories/poi.repo';
import { AppError } from '../middlewares/error.middleware';

const normalizeMenuItemData = (data: any) => {
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const priceValue = data.price === undefined || data.price === null || data.price === '' ? undefined : Number(data.price);

  if (!name) {
    throw new AppError(400, 'Menu item name is required');
  }

  if (priceValue !== undefined && Number.isNaN(priceValue)) {
    throw new AppError(400, 'Price must be a valid number');
  }

  return {
    name,
    price: priceValue,
    description: typeof data.description === 'string' && data.description.trim() ? data.description.trim() : undefined,
    imageUrl: typeof data.imageUrl === 'string' && data.imageUrl.trim() ? data.imageUrl.trim() : undefined,
    isAvailable: typeof data.isAvailable === 'boolean' ? data.isAvailable : true
  };
};

export const addMenuItem = async (poiId: string, userId: string, userRole: string, data: any) => {
  const poi = await poiRepo.findPOIById(poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to add menu items to this POI');
  }

  const menuItemData = normalizeMenuItemData(data);

  try {
    const item = await menuItemRepo.createMenuItem({
      ...menuItemData,
      poi: { connect: { id: poiId } }
    });

    return menuItemRepo.findMenuItemById(item.id);
  } catch (error: any) {
    console.error('Failed to create menu item:', error);
    throw new AppError(400, error?.message || 'Failed to create menu item');
  }
};

export const listOwnerMenuItems = async (
  ownerId: string,
  filters: {
    search?: string;
    poiId?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  return menuItemRepo.findMenuItemsByOwnerWithFilters(ownerId, filters);
};

export const updateMenuItem = async (id: string, userId: string, userRole: string, data: any) => {
  const item = await menuItemRepo.findMenuItemById(id);
  if (!item) throw new AppError(404, 'Menu item not found');

  const poi = await poiRepo.findPOIById(item.poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to update this menu item');
  }

  const menuItemData = normalizeMenuItemData({
    name: data.name ?? item.name,
    price: data.price ?? item.price,
    description: data.description ?? item.description,
    imageUrl: data.imageUrl ?? item.imageUrl,
    isAvailable: typeof data.isAvailable === 'boolean' ? data.isAvailable : item.isAvailable
  });

  try {
    const updated = await menuItemRepo.updateMenuItem(id, menuItemData);
    return menuItemRepo.findMenuItemById(updated.id);
  } catch (error: any) {
    console.error('Failed to update menu item:', error);
    throw new AppError(400, error?.message || 'Failed to update menu item');
  }
};

export const deleteMenuItem = async (id: string, userId: string, userRole: string) => {
  const item = await menuItemRepo.findMenuItemById(id);
  if (!item) throw new AppError(404, 'Menu item not found');

  const poi = await poiRepo.findPOIById(item.poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to delete this menu item');
  }

  return menuItemRepo.deleteMenuItem(id);
};

import * as menuItemRepo from '../repositories/menuItem.repo';
import * as poiRepo from '../repositories/poi.repo';
import { AppError } from '../middlewares/error.middleware';

export const addMenuItem = async (poiId: string, userId: string, userRole: string, data: any) => {
  const poi = await poiRepo.findPOIById(poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to add menu items to this POI');
  }

  return menuItemRepo.createMenuItem({
    ...data,
    poi: { connect: { id: poiId } }
  });
};

export const updateMenuItem = async (id: string, userId: string, userRole: string, data: any) => {
  const item = await menuItemRepo.findMenuItemById(id);
  if (!item) throw new AppError(404, 'Menu item not found');

  const poi = await poiRepo.findPOIById(item.poiId);
  if (!poi) throw new AppError(404, 'POI not found');

  if (userRole !== 'ADMIN' && poi.ownerId !== userId) {
    throw new AppError(403, 'You do not have permission to update this menu item');
  }

  return menuItemRepo.updateMenuItem(id, data);
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

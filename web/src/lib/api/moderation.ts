import { api } from '../api';

export type ModerationType = 'POI_CREATE' | 'POI_DELETE' | 'UPGRADE_OWNER';
export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ModerationRequest {
  id: string;
  type: ModerationType;
  targetId: string;
  requesterId: string;
  status: ModerationStatus;
  requestedAt: string;
  approvedAt?: string;
  targetName?: string; // Bổ sung từ controller
  targetInfo?: any;
  requester?: {
    id: string;
    fullName?: string;
    email: string;
  };
}

export const moderationApi = {
  /**
   * Lấy danh sách yêu cầu của bản thân (Owner/User)
   */
  getMyRequests: async () => {
    const response = await api.get('/moderation/my-requests');
    return response.data as ModerationRequest[];
  },

  /**
   * Yêu cầu nâng cấp lên Owner (Dành cho User)
   */
  requestUpgrade: async () => {
    const response = await api.post('/moderation/request-upgrade', {});
    return response.data;
  },
};

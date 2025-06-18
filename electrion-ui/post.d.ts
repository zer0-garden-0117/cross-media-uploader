export interface PostData {
  id?: string;
  image?: string;
  imageData?: ArrayBuffer;
  status?: 'pending' | 'posted' | 'failed';
  scheduledTime: string;
  comment: string;
  tags: string[];
  createdAt?: string;
}
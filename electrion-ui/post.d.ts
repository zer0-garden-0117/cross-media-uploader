export interface PostData {
  date: string;
  comment: string;
  imageData: ArrayBuffer;
  tags: string[];
}

export interface SavedPostData {
  id: string;
  scheduledTime: string;
  comment: string;
  image: string;
  tags: string[];
  status: 'pending' | 'posted' | 'failed';
  createdAt: string;
}
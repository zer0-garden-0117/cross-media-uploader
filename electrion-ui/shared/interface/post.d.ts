import { StatusType } from '../types/status';
import { CharacterType } from '../types/character';
import { GenreType } from '../types/genre';
import { TargetType } from '../types/target';

export interface PostData {
  id?: string;
  image?: string;
  imageData?: ArrayBuffer;
  status?: StatusType;
  scheduledTime: string;
  comment: string;
  tags: string[];
  character: CharacterType;
  genre: GenreType;
  targets: TargetType[];
  createdAt?: string;
}
export const GenreType = {
  ILLUSTRATION: 'illustration',
  ICON: 'icon',
} as const;

export type GenreType = typeof GenreType[keyof typeof GenreType];

export const AllGenreType = Object.values(GenreType);
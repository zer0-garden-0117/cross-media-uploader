export const CharacterType = {
  OTHER: 'その他',
  MASHIRO: '零崎真白',
  KURUMI: '零崎くるみ',
  SUZU: '零崎鈴',
  AOI: '零崎蒼',
} as const;

export type CharacterType = typeof CharacterType[keyof typeof CharacterType];

export const AllCharacterType = Object.values(CharacterType);
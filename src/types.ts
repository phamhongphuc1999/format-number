export type NumberType = number | string | bigint;

export type RoundingMode = 'half' | 'up' | 'down' | 'banker' | 'truncate';
export type RoundingConfigType = Partial<{ mode: RoundingMode; precision: number }>;
export type OtherMetadataType = Partial<{
  prefix: string;
  suffix: string;
  isSmall: boolean;
  isScientific: boolean;
}>;
export type MetadataType = RoundingConfigType & OtherMetadataType & Partial<{ isCompact: boolean }>;

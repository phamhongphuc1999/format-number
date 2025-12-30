export type NumberType = number | string;

export type RoundingMode = 'half' | 'up' | 'down' | 'banker' | 'truncate';
export type RoundingConfigType = Partial<{ mode: RoundingMode; precision: number }>;

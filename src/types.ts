export interface Map {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Lineup {
  id: string;
  map_id: string;
  side: 'T' | 'CT';
  grenade_type: 'smoke' | 'flash' | 'molotov' | 'he';
  target: string;
  title: string;
  description?: string;
  telegram_message_id: number;
  thumbnail_url?: string;
  created_at: Date;
  updated_at: Date;
}
export interface MapResponse {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  sort_order: number;
  lineup_count: number;
}

export interface LineupResponse {
  id: string;
  map_id: string;
  side: 'T' | 'CT';
  grenade_type: 'smoke' | 'flash' | 'molotov' | 'he';
  target: string;
  title: string;
  description?: string;
  telegram_message_id: number;
  thumbnail_url?: string;
  telegram_url?: string;
}

export interface LineupListResponse {
  items: LineupResponse[];
  page: number;
  limit: number;
  total: number;
}
// src/api/types.ts
export interface Track {
  /** Unique identifier for the track */
  id: string;
  /** Title of the track */
  title: string;
  /** Artist who created the track */
  artist: string;
  /** Optional album the track belongs to */
  album?: string;
  /** List of genres associated with the track */
  genres: string[];
  /** URL-friendly version of the title (kebab-case) */
  slug: string;
  /** Optional URL to the track's cover image */
  coverImage?: string;
  /** Optional filename of the uploaded audio file */
  audioFile?: string;
  /** ISO timestamp of when the track was created */
  createdAt: string;
  /** ISO timestamp of when the track was last updated */
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
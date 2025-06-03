// src/api/client.ts
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  slug: string;
  coverImage?: string;
  audioFile?: string;
  createdAt: string;
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

// src/api/client.ts
const API_BASE_URL = 'http://localhost:8000/api';

export const fetchTracks = async (params?: Record<string, string>) => {
  const query = params ? new URLSearchParams(params).toString() : '';
  const response = await fetch(`${API_BASE_URL}/tracks?${query}`);
  if (!response.ok) throw new Error('Failed to fetch tracks');
  return response.json();
};

export const fetchGenres = async () => {
  const response = await fetch(`${API_BASE_URL}/genres`);
  if (!response.ok) throw new Error('Failed to fetch genres');
  return response.json();
};

// Решта функцій залишаються незмінними, але також використовують /api префікс
export const createTrack = async (track: Omit<Track, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
  const response = await fetch(`${API_BASE_URL}/tracks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(track),
  });
  if (!response.ok) throw new Error('Failed to create track');
  return response.json();
};

export const updateTrack = async (id: string, track: Partial<Omit<Track, 'id' | 'slug' | 'createdAt' | 'updatedAt'>>) => {
  const response = await fetch(`${API_BASE_URL}/tracks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(track),
  });
  if (!response.ok) throw new Error('Failed to update track');
  return response.json() as Promise<Track>;
};

export const deleteTrack = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/tracks/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete track');
  }
  
  return true; // Успішне видалення
};

export const uploadAudio = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/tracks/${id}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload audio');
  }
  
  return response.json() as Promise<Track>;
};
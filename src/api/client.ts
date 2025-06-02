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

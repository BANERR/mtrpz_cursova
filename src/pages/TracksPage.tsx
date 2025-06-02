import { useState, useEffect, useCallback } from 'react';
import { 
  Track,
  Genre,
} from '../api/client';
import { useDebounce } from '../hooks/useDebounce';

export const TracksPage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadTracks = useCallback(async () => {
    //load tracks
  }, [page, limit, debouncedSearchTerm, selectedGenre, selectedArtist]);

  const loadGenres = async () => {
    //load genres
  };

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  const handleCreateTrack = async (track: Omit<Track, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    //create track
  };

  const handleUpdateTrack = async (updatedData: Omit<Track, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    // update track
  };

  const handleDeleteTrack = async () => {
    //delete track
  };

  const handleRefreshTracks = useCallback(() => {
    loadTracks(); // Викликаємо функцію завантаження треків
  }, [loadTracks]);

  return (
    <div className="container">
      <h1 data-testid="tracks-header">Music Tracks</h1>
      
      <div className="controls">
        <button 
          onClick={() => setIsCreateModalOpen(true)} 
          data-testid="create-track-button"
        >
          Create Track
        </button>
        
        <input
          type="text"
          placeholder="Search tracks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
        
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          data-testid="filter-genre"
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        
        <select
          value={selectedArtist}
          onChange={(e) => setSelectedArtist(e.target.value)}
          data-testid="filter-artist"
        >
          <option value="">All Artists</option>
          {Array.from(new Set(tracks.map(t => t.artist))).map(artist => (
            <option key={artist} value={artist}>{artist}</option>
          ))}
        </select>
      </div>
           
      {error && <div className="error">{error}</div>}
      <div data-testid="pagination">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          data-testid="pagination-prev"
        >
          Previous
        </button>
        <span>Page {page} of {Math.ceil(total / limit)}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= Math.ceil(total / limit)}
          data-testid="pagination-next"
        >
          Next
        </button>
      </div>
    </div>
  );
};
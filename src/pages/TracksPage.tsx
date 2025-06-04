import { useState, useEffect, useCallback } from 'react';
import { 
  fetchTracks, 
  fetchGenres, 
  deleteTrack, 
  createTrack,
  updateTrack,
  Track,
  Genre,
  PaginatedResponse
} from '../api/client';
import { TrackList } from '../components/TrackList';
import { TrackForm } from '../components/TrackForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useDebounce } from '../hooks/useDebounce';

export const TracksPage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(9);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [deletingTrackId, setDeletingTrackId] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadTracks = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
      };
      
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (selectedGenre) params.genre = selectedGenre;
      if (selectedArtist) params.artist = selectedArtist;
      
      const response = await fetchTracks(params);
      setTracks(response.data);
      console.log(response.data)
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tracks');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearchTerm, selectedGenre, selectedArtist]);

  const loadGenres = async () => {
    try {
      const genres = await fetchGenres();
      console.log(genres)
      setGenres(genres);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load genres');
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  const handleCreateTrack = async (track: Omit<Track, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTrack = await createTrack(track);
      setTracks(prev => [newTrack, ...prev]);
      setIsCreateModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create track');
    }
  };

  const handleUpdateTrack = async (updatedData: Omit<Track, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTrack) return;
    try {
      const updatedTrack = await updateTrack(editingTrack.id, updatedData);
      setTracks(prev => prev.map(t => t.id === updatedTrack.id ? updatedTrack : t));
      setEditingTrack(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update track');
    }
  };

  const handleDeleteTrack = async () => {
    if (!deletingTrackId) return;
    
    try {
      await deleteTrack(deletingTrackId);
      setTracks(prev => prev.filter(track => track.id !== deletingTrackId));
      setDeletingTrackId(null);
      // Додати сповіщення про успішне видалення
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete track');
    }
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
            <option key={`genre-${genre}`}>{`${genre}`}</option>
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
      
      {loading && <LoadingIndicator data-testid="loading-tracks" />}
      {error && <div className="error">{error}</div>}

      {deletingTrackId && (
        <ConfirmDialog
          message="Are you sure you want to delete this track?"
          onConfirm={handleDeleteTrack}
          onCancel={() => setDeletingTrackId(null)}
        />
      )}
      
      <TrackList 
        tracks={tracks}
        onEdit={setEditingTrack}
        onDelete={setDeletingTrackId}
        onRefresh={handleRefreshTracks}
      />
      
      <div data-testid="pagination">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          data-testid="pagination-prev"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= Math.ceil(total / limit)}
          data-testid="pagination-next"
        >
          Next
        </button>
      </div>
      
      {isCreateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Track</h2>
            <TrackForm
              onSubmit={handleCreateTrack}
              onCancel={() => setIsCreateModalOpen(false)}
              isLoading={loading}
            />
          </div>
        </div>
      )}
      
      {editingTrack && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Track</h2>
            <TrackForm
              track={editingTrack}
              onSubmit={handleUpdateTrack}
              onCancel={() => setEditingTrack(null)}
              isLoading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};
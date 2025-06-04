import { useEffect, useState } from 'react';
import { Track } from '../api/types';
import { fetchGenres } from '../api/client';

interface TrackFormProps {
  track?: Track;
  onSubmit: (track: Omit<Track, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const TrackForm = ({ track, onSubmit, onCancel, isLoading }: TrackFormProps) => {
  const [title, setTitle] = useState(track?.title || '');
  const [artist, setArtist] = useState(track?.artist || '');
  const [album, setAlbum] = useState(track?.album || '');
  const [coverImage, setCoverImage] = useState(track?.coverImage || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(track?.genres || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!artist.trim()) newErrors.artist = 'Artist is required';
    if (selectedGenres.length === 0) newErrors.genres = 'At least one genre is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadGenres = async () => {
    try {
      const genres = await fetchGenres();
      setAvailableGenres(genres);
    } catch (err) {
      console.error('Failed to load genres:', err);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      title,
      artist,
      album,
      coverImage: coverImage || undefined,
      genres: selectedGenres,
    });
  };

  const toggleGenre = (genreName: string) => {
    setSelectedGenres(prev =>
      prev.includes(genreName)
        ? prev.filter(name => name !== genreName)
        : [...prev, genreName]
    );
  };

  return (
    <form onSubmit={handleSubmit} data-testid="track-form" className="track-form">
      <div className="form-group">
        <label>Title*</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-testid="input-title"
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message" data-testid="error-title">{errors.title}</span>}
      </div>
      
      <div className="form-group">
        <label>Artist*</label>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          data-testid="input-artist"
          className={errors.artist ? 'error' : ''}
        />
        {errors.artist && <span className="error-message" data-testid="error-artist">{errors.artist}</span>}
      </div>
      
      <div className="form-group">
        <label>Album</label>
        <input
          type="text"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          data-testid="input-album"
        />
      </div>
      
      <div className="form-group">
        <label>Cover Image URL</label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          data-testid="input-cover-image"
        />
      </div>
      
      <div className="form-group">
        <label>Genres*</label>
        <div className="genre-buttons">
          {availableGenres.map(genre => (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              className={`genre-button ${selectedGenres.includes(genre) ? 'selected' : ''}`}
              data-testid={`genre-button-${genre}`}
            >
              {genre}
            </button>
          ))}
        </div>
        {errors.genres && <span className="error-message" data-testid="error-genres">{errors.genres}</span>}
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          disabled={isLoading} 
          data-testid="submit-button"
          className="submit-button"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={isLoading}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
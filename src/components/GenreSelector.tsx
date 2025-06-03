// src/components/GenreSelector.tsx
import { Genre } from '../api/types';

interface GenreSelectorProps {
  genres: Genre[];
  selectedGenres: string[];
  onSelect: (genreId: string) => void;
}

export const GenreSelector = ({ genres, selectedGenres, onSelect }: GenreSelectorProps) => {
  return (
    <div className="genre-selector" data-testid="genre-selector">
      <div className="genre-list">
        {genres.map(genre => (
          <div
            key={genre.id}
            className={`genre-tag ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
            onClick={() => onSelect(genre.id)}
          >
            {genre.name}
          </div>
        ))}
      </div>
    </div>
  );
};
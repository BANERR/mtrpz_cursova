import { Track } from "../api/types";
import { TrackItem } from './TrackItem';

interface TrackListProps {
  tracks: Track[];
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void; // Додаємо цей пропс
}

export const TrackList = ({ tracks, onEdit, onDelete, onRefresh }: TrackListProps) => {
  return (
    <div className="track-list">
      {tracks.map(track => (
        <TrackItem
          key={track.id}
          track={track}
          onEdit={onEdit}
          onDelete={onDelete}
          onUploadSuccess={onRefresh} // Передаємо функцію оновлення
        />
      ))}
    </div>
  );
};
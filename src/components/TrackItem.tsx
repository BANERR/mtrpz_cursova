import { useState } from 'react';
import { Track } from '../api/types';
import { uploadAudio } from '../api/client';
import { AudioPlayer } from './AudioPlayer';


interface TrackItemProps {
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
  onUploadSuccess: () => void;
}

export const TrackItem = ({ track, onEdit, onDelete, onUploadSuccess }: TrackItemProps) => {

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload MP3 or WAV file');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      await uploadAudio(track.id, file);
      onUploadSuccess(); // Оновлюємо список треків
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  console.log(track.coverImage)

  return (
    <div className="track-item" data-testid={`track-item-${track.id}`}>
      <div>
        <h3 data-testid={`track-item-${track.id}-title`}>{track.title}</h3>
        <p data-testid={`track-item-${track.id}-artist`}>{track.artist}</p>
        {track.album && <p>Album: {track.album}</p>}
        <p>Created: {new Date(track.createdAt).toLocaleDateString()}</p>
        <div>
          {track.genres.map(genre => (
            <span key={genre} className="genre-tag">{genre}</span>
          ))}
        </div>
      </div>
      
      {track.coverImage ? (
        <img src={track.coverImage} alt="Cover"  className='image-container'/>
      ) : (
        <div className="default-cover">No Cover</div>
      )}
      
      {track.audioFile && (
        <AudioPlayer audioUrl={track.audioFile} trackId={track.id} />
      )}
      
      <div className="actions">
        <button onClick={() => onEdit(track)} data-testid={`edit-track-${track.id}`}>
          Edit
        </button>
        <button onClick={() => onDelete(track.id)} data-testid={`delete-track-${track.id}`}>
          Delete
        </button>
        
      </div>
    </div>
  );
};
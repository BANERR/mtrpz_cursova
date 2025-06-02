interface AudioPlayerProps {
  audioUrl: string;
  trackId: string;
}

export const AudioPlayer = ({ audioUrl, trackId }: AudioPlayerProps) => {
  return (
    <div className="audio-player" data-testid={`audio-player-${trackId}`}>
      <audio controls>
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}; 
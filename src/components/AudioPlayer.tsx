interface AudioPlayerProps {
  audioUrl: string;
  trackId: string;
}

const audio = new URL('../../server/data/uploads/test.mp3', import.meta.url).href;

export const AudioPlayer = ({ trackId, audioUrl }: AudioPlayerProps) => {
  const audioSrc = `http://localhost:8000/api/tracks/${audioUrl}/audio`;
  console.log(audioSrc)

  return (
    <div>
      <audio controls>
        <source src={audio} type="audio/mpeg" />
      </audio>
    </div>
  );
};




import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Music, Play, Square } from "lucide-react";
import { toast } from "sonner";

interface Song {
  title: string;
  artist: string;
  url: string;
}

const moodPlaylists: Record<string, Song[]> = {
  Happy: [
    { title: "Beautiful Stress Relief", artist: "Ambient Mix", url: "/songs/beautiful-stress-relief-ambient-184569.mp3" },
    { title: "Instant Stress Relief", artist: "Tibetan Singing Bowls", url: "/songs/instant-stress-relief-nature-sounds-amp-tibetan-singing-bowls-361111.mp3" },
    { title: "Relaxation Meditation", artist: "La Sérénité", url: "/songs/relaxation_meditation-anti-stress-trouver-la-serenite-352266.mp3" },
    { title: "Soft Massage Music", artist: "Sleep Meditation", url: "/songs/soft-massage-music-sleep-meditation-ultimate-stress-relief-337588.mp3" },
    { title: "Tension", artist: "Instrumental", url: "/songs/tension-292489.mp3" },
  ],
  Sad: [
    { title: "Tension", artist: "Instrumental", url: "/songs/tension-292489.mp3" },
    { title: "Soft Massage Music", artist: "Meditation Mix", url: "/songs/soft-massage-music-sleep-meditation-ultimate-stress-relief-337588.mp3" },
    { title: "Relaxation Meditation", artist: "Anti-Stress Therapy", url: "/songs/relaxation_meditation-anti-stress-trouver-la-serenite-352266.mp3" },
    { title: "Instant Stress Relief", artist: "Nature Sounds", url: "/songs/instant-stress-relief-nature-sounds-amp-tibetan-singing-bowls-361111.mp3" },
    { title: "Beautiful Stress Relief", artist: "Ambient", url: "/songs/beautiful-stress-relief-ambient-184569.mp3" },
  ],
  Angry: [
    { title: "Relaxation Meditation", artist: "Mind Calm", url: "/songs/relaxation_meditation-anti-stress-trouver-la-serenite-352266.mp3" },
    { title: "Soft Massage Music", artist: "Peaceful Tones", url: "/songs/soft-massage-music-sleep-meditation-ultimate-stress-relief-337588.mp3" },
    { title: "Beautiful Stress Relief", artist: "Ambient Peace", url: "/songs/beautiful-stress-relief-ambient-184569.mp3" },
    { title: "Instant Stress Relief", artist: "Tibetan Bowls", url: "/songs/instant-stress-relief-nature-sounds-amp-tibetan-singing-bowls-361111.mp3" },
    { title: "Tension", artist: "Calm Release", url: "/songs/tension-292489.mp3" },
  ],
  Anxious: [
    { title: "Instant Stress Relief", artist: "Nature Relax", url: "/songs/instant-stress-relief-nature-sounds-amp-tibetan-singing-bowls-361111.mp3" },
    { title: "Relaxation Meditation", artist: "Deep Focus", url: "/songs/relaxation_meditation-anti-stress-trouver-la-serenite-352266.mp3" },
    { title: "Soft Massage Music", artist: "Sleep Therapy", url: "/songs/soft-massage-music-sleep-meditation-ultimate-stress-relief-337588.mp3" },
    { title: "Tension", artist: "Instrumental", url: "/songs/tension-292489.mp3" },
    { title: "Beautiful Stress Relief", artist: "Ambient Mix", url: "/songs/beautiful-stress-relief-ambient-184569.mp3" },
  ],
  Calm: [
    { title: "Beautiful Stress Relief", artist: "Ambient", url: "/songs/beautiful-stress-relief-ambient-184569.mp3" },
    { title: "Instant Stress Relief", artist: "Nature Sounds", url: "/songs/instant-stress-relief-nature-sounds-amp-tibetan-singing-bowls-361111.mp3" },
    { title: "Relaxation Meditation", artist: "La Sérénité", url: "/songs/relaxation_meditation-anti-stress-trouver-la-serenite-352266.mp3" },
    { title: "Soft Massage Music", artist: "Sleep Meditation", url: "/songs/soft-massage-music-sleep-meditation-ultimate-stress-relief-337588.mp3" },
    { title: "Tension", artist: "Instrumental", url: "/songs/tension-292489.mp3" },
  ],
  Tired: [
    { title: "Soft Massage Music", artist: "Sleep Therapy", url: "/songs/soft-massage-music-sleep-meditation-ultimate-stress-relief-337588.mp3" },
    { title: "Relaxation Meditation", artist: "Peaceful Mind", url: "/songs/relaxation_meditation-anti-stress-trouver-la-serenite-352266.mp3" },
    { title: "Beautiful Stress Relief", artist: "Ambient Dreams", url: "/songs/beautiful-stress-relief-ambient-184569.mp3" },
    { title: "Instant Stress Relief", artist: "Nature Calm", url: "/songs/instant-stress-relief-nature-sounds-amp-tibetan-singing-bowls-361111.mp3" },
    { title: "Tension", artist: "Instrumental Chill", url: "/songs/tension-292489.mp3" },
  ],
};

const Playlist = () => {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingSong, setPlayingSong] = useState<string | null>(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("mood_history") || "[]");
    if (history.length > 0) {
      const latestMood = history[history.length - 1].mood;
      setCurrentMood(latestMood);
      setPlaylist(moodPlaylists[latestMood] || []);
    }
  }, []);

  // 🎵 Play selected song
  const handlePlaySong = (song: Song) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(song.url);
    setCurrentAudio(audio);
    setPlayingSong(song.title);
    audio.play();

    toast.success(`Now playing: ${song.title} by ${song.artist}`);

    audio.onended = () => setPlayingSong(null);
  };

  // 🛑 Stop current song
  const handleStopSong = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setPlayingSong(null);
      toast.message("Playback stopped");
    }
  };

  if (!currentMood) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Mood Selected</CardTitle>
              <CardDescription>
                Please select a mood from the dashboard first to get playlist recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-[var(--shadow-glow)]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Music className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Your {currentMood} Playlist</CardTitle>
                <CardDescription>Curated songs to match your current mood</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {playlist.map((song, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    playingSong === song.title
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <div className="flex gap-2">
                     <Button
                    variant="ghost"
                    onClick={() => {playingSong ? handleStopSong() : handlePlaySong(song)}}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {playingSong  ? <Square /> : <Play />}
                  </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Playlist;

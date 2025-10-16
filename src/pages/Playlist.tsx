import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Music, Play } from "lucide-react";
import { toast } from "sonner";

interface Song {
  title: string;
  artist: string;
}

const moodPlaylists: Record<string, Song[]> = {
  Happy: [
    { title: "Happy", artist: "Pharrell Williams" },
    { title: "Good Vibrations", artist: "The Beach Boys" },
    { title: "Walking on Sunshine", artist: "Katrina and the Waves" },
    { title: "Don't Stop Me Now", artist: "Queen" },
    { title: "I Gotta Feeling", artist: "Black Eyed Peas" },
  ],
  Sad: [
    { title: "Someone Like You", artist: "Adele" },
    { title: "The Scientist", artist: "Coldplay" },
    { title: "Hurt", artist: "Johnny Cash" },
    { title: "Mad World", artist: "Gary Jules" },
    { title: "Tears in Heaven", artist: "Eric Clapton" },
  ],
  Angry: [
    { title: "Break Stuff", artist: "Limp Bizkit" },
    { title: "Killing in the Name", artist: "Rage Against the Machine" },
    { title: "Bodies", artist: "Drowning Pool" },
    { title: "Enter Sandman", artist: "Metallica" },
    { title: "Smells Like Teen Spirit", artist: "Nirvana" },
  ],
  Anxious: [
    { title: "Breathe Me", artist: "Sia" },
    { title: "Weightless", artist: "Marconi Union" },
    { title: "Clair de Lune", artist: "Claude Debussy" },
    { title: "Gymnopedie No. 1", artist: "Erik Satie" },
    { title: "River Flows in You", artist: "Yiruma" },
  ],
  Calm: [
    { title: "Weightless", artist: "Marconi Union" },
    { title: "Sunset Lover", artist: "Petit Biscuit" },
    { title: "Islands", artist: "Ludovico Einaudi" },
    { title: "Holocene", artist: "Bon Iver" },
    { title: "Pure Shores", artist: "All Saints" },
  ],
  Tired: [
    { title: "Moonlight Sonata", artist: "Beethoven" },
    { title: "Nocturne in E-flat", artist: "Chopin" },
    { title: "Spiegel im Spiegel", artist: "Arvo Pärt" },
    { title: "Sleep", artist: "Max Richter" },
    { title: "Clair de Lune", artist: "Claude Debussy" },
  ],
};

const Playlist = () => {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("mood_history") || "[]");
    if (history.length > 0) {
      const latestMood = history[history.length - 1].mood;
      setCurrentMood(latestMood);
      setPlaylist(moodPlaylists[latestMood] || []);
    }
  }, []);

  const handlePlaySong = (song: Song) => {
    // Create a simple audio notification
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    toast.success(`Now playing: ${song.title} by ${song.artist}`);
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
                <CardDescription>
                  Curated songs to match your current mood
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {playlist.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <Button
                    onClick={() => handlePlaySong(song)}
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
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

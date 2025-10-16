import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Music, LogOut, Gamepad2 } from "lucide-react";
import MoodSelector from "@/components/MoodSelector";
import MoodHistory from "@/components/MoodHistory";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("moodsense_user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    // Save mood to history
    const history = JSON.parse(localStorage.getItem("mood_history") || "[]");
    history.push({ mood, timestamp: new Date().toISOString() });
    localStorage.setItem("mood_history", JSON.stringify(history));
    toast.success(`Mood "${mood}" recorded!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MoodSense</span>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-[var(--shadow-glow)]">
            <CardHeader>
              <CardTitle>How are you feeling?</CardTitle>
              <CardDescription>Select your current mood</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodSelector onMoodSelect={handleMoodSelect} selectedMood={selectedMood} />
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-glow)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                Mood Playlist
              </CardTitle>
              <CardDescription>Get music recommendations based on your mood</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/playlist")} 
                className="w-full"
                disabled={!selectedMood}
              >
                Generate Playlist
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-[var(--shadow-glow)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Bubble Pop Game
              </CardTitle>
              <CardDescription>Relax and pop some bubbles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/game")} className="w-full" variant="secondary">
                Play Game
              </Button>
            </CardContent>
          </Card>

          <MoodHistory />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

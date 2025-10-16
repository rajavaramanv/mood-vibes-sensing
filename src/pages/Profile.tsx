import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, TrendingUp, Smile, Calendar } from "lucide-react";
import { toast } from "sonner";

interface MoodEntry {
  mood: string;
  timestamp: string;
}

interface UserProfile {
  name: string;
  email: string;
  age: string;
}

const moodScores: Record<string, number> = {
  Happy: 100,
  Calm: 80,
  Tired: 50,
  Anxious: 40,
  Sad: 20,
  Angry: 10,
};

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({ name: "", email: "", age: "" });
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load user profile
    const userStr = localStorage.getItem("moodsense_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const savedProfile = localStorage.getItem("user_profile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setProfile({ name: "", email: user.email || "", age: "" });
      }
    }

    // Load mood history
    const history = JSON.parse(localStorage.getItem("mood_history") || "[]");
    setMoodHistory(history);
  }, []);

  const calculateAverageMood = () => {
    if (moodHistory.length === 0) return "N/A";
    const totalScore = moodHistory.reduce((sum, entry) => sum + (moodScores[entry.mood] || 0), 0);
    const average = totalScore / moodHistory.length;
    
    if (average >= 80) return "Very Positive";
    if (average >= 60) return "Positive";
    if (average >= 40) return "Neutral";
    if (average >= 20) return "Low";
    return "Very Low";
  };

  const calculateHappinessPercentage = () => {
    if (moodHistory.length === 0) return 0;
    const totalScore = moodHistory.reduce((sum, entry) => sum + (moodScores[entry.mood] || 0), 0);
    return Math.round(totalScore / moodHistory.length);
  };

  const getMoodFrequency = () => {
    const frequency: Record<string, number> = {};
    moodHistory.forEach((entry) => {
      frequency[entry.mood] = (frequency[entry.mood] || 0) + 1;
    });
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  const handleSaveProfile = () => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const happinessPercentage = calculateHappinessPercentage();

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

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* User Details Card */}
        <Card className="shadow-[var(--shadow-glow)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your age"
              />
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveProfile} className="flex-1">
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Happiness Percentage */}
          <Card className="shadow-[var(--shadow-glow)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Smile className="w-5 h-5" />
                Happiness Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-2">
                <div className="text-5xl font-bold text-primary">{happinessPercentage}%</div>
                <p className="text-sm text-muted-foreground">Overall wellness score</p>
              </div>
            </CardContent>
          </Card>

          {/* Average Mood */}
          <Card className="shadow-[var(--shadow-glow)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5" />
                Average Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">{calculateAverageMood()}</div>
                <p className="text-sm text-muted-foreground">Based on all entries</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Entries */}
          <Card className="shadow-[var(--shadow-glow)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-2">
                <div className="text-5xl font-bold text-primary">{moodHistory.length}</div>
                <p className="text-sm text-muted-foreground">Moods tracked</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Moods */}
        <Card className="shadow-[var(--shadow-glow)]">
          <CardHeader>
            <CardTitle>Top Moods</CardTitle>
            <CardDescription>Your most frequent emotional states</CardDescription>
          </CardHeader>
          <CardContent>
            {getMoodFrequency().length > 0 ? (
              <div className="space-y-3">
                {getMoodFrequency().map(([mood, count], index) => (
                  <div
                    key={mood}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                      <span className="font-medium">{mood}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{count} times</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No mood data available yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent History */}
        <Card className="shadow-[var(--shadow-glow)]">
          <CardHeader>
            <CardTitle>Recent Mood History</CardTitle>
            <CardDescription>Your latest mood entries</CardDescription>
          </CardHeader>
          <CardContent>
            {moodHistory.length > 0 ? (
              <div className="space-y-3">
                {moodHistory.slice(-10).reverse().map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <span className="font-medium">{entry.mood}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No mood history available yet
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;

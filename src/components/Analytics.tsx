import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface MoodEntry {
  mood: string;
  timestamp: string;
}

const moodScores: Record<string, number> = {
  Happy: 100,
  Calm: 80,
  Tired: 50,
  Anxious: 40,
  Sad: 20,
  Angry: 10,
};

const Analytics = () => {
  const [stats, setStats] = useState({
    weeklyAverage: 0,
    trend: "stable" as "up" | "down" | "stable",
    moodStreak: 0,
  });

  useEffect(() => {
    const history: MoodEntry[] = JSON.parse(localStorage.getItem("mood_history") || "[]");
    
    if (history.length === 0) return;

    // Calculate weekly average
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyMoods = history.filter(entry => new Date(entry.timestamp) > weekAgo);
    
    if (weeklyMoods.length > 0) {
      const totalScore = weeklyMoods.reduce((sum, entry) => sum + (moodScores[entry.mood] || 0), 0);
      const average = Math.round(totalScore / weeklyMoods.length);
      
      // Calculate trend
      const halfPoint = Math.floor(weeklyMoods.length / 2);
      const firstHalf = weeklyMoods.slice(0, halfPoint);
      const secondHalf = weeklyMoods.slice(halfPoint);
      
      const firstAvg = firstHalf.reduce((sum, entry) => sum + (moodScores[entry.mood] || 0), 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, entry) => sum + (moodScores[entry.mood] || 0), 0) / secondHalf.length;
      
      let trend: "up" | "down" | "stable" = "stable";
      if (secondAvg > firstAvg + 10) trend = "up";
      else if (secondAvg < firstAvg - 10) trend = "down";
      
      // Calculate positive mood streak
      let streak = 0;
      for (let i = history.length - 1; i >= 0; i--) {
        if (moodScores[history[i].mood] >= 60) {
          streak++;
        } else {
          break;
        }
      }
      
      setStats({ weeklyAverage: average, trend, moodStreak: streak });
    }
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="shadow-[var(--shadow-glow)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            Weekly Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{stats.weeklyAverage}%</div>
          <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-glow)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            Mood Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary capitalize">{stats.trend}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.trend === "up" && "Your mood is improving! 🎉"}
            {stats.trend === "down" && "Consider self-care activities"}
            {stats.trend === "stable" && "Maintaining balance"}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-glow)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5" />
            Positive Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{stats.moodStreak}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.moodStreak > 0 ? "Consecutive positive moods" : "Start a new streak!"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

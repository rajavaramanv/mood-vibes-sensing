import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface MoodEntry {
  mood: string;
  timestamp: string;
}

const MoodHistory = () => {
  const [history, setHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const stored = localStorage.getItem("mood_history");
      if (stored) {
        setHistory(JSON.parse(stored).slice(-5).reverse());
      }
    };
    
    loadHistory();
    window.addEventListener("storage", loadHistory);
    return () => window.removeEventListener("storage", loadHistory);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="shadow-[var(--shadow-glow)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Moods
        </CardTitle>
        <CardDescription>Your mood history</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No moods recorded yet
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <span className="font-medium">{entry.mood}</span>
                <span className="text-sm text-muted-foreground">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodHistory;

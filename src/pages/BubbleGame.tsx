import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocityY: number;
}

const colors = [
  "hsl(270, 75%, 60%)",
  "hsl(280, 70%, 55%)",
  "hsl(200, 75%, 60%)",
  "hsl(150, 75%, 60%)",
  "hsl(45, 75%, 60%)",
];

const BubbleGame = () => {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const createBubble = useCallback(() => {
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - 100),
      y: window.innerHeight + 50,
      size: 40 + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityY: -2 - Math.random() * 3,
    };
    return newBubble;
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      setBubbles((prev) => {
        // Remove bubbles that went off screen
        const filtered = prev.filter((b) => b.y > -200);
        
        // Move bubbles up
        const moved = filtered.map((b) => ({
          ...b,
          y: b.y + b.velocityY,
        }));

        // Add new bubbles randomly
        if (Math.random() < 0.3 && moved.length < 15) {
          moved.push(createBubble());
        }

        return moved;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [isPlaying, createBubble]);

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 10);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setBubbles([]);
    toast.success("Game started! Pop the bubbles!");
  };

  const stopGame = () => {
    setIsPlaying(false);
    toast.success(`Game over! Final score: ${score}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-xl font-bold">Score: {score}</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto mb-6 shadow-[var(--shadow-glow)]">
          <CardHeader>
            <CardTitle>Bubble Pop Game</CardTitle>
            <CardDescription>
              Pop the bubbles to relieve stress and increase your score!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isPlaying ? (
              <Button onClick={startGame} className="w-full" size="lg">
                Start Game
              </Button>
            ) : (
              <Button onClick={stopGame} className="w-full" size="lg" variant="secondary">
                Stop Game
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="relative w-full h-[500px] bg-gradient-to-b from-secondary to-background rounded-xl overflow-hidden border border-border">
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              onClick={() => popBubble(bubble.id)}
              className="absolute rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-90"
              style={{
                left: `${bubble.x}px`,
                bottom: `${window.innerHeight - bubble.y}px`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                backgroundColor: bubble.color,
                opacity: 0.8,
                border: '3px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}
            />
          ))}
          {!isPlaying && bubbles.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Click "Start Game" to begin popping bubbles!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BubbleGame;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind } from "lucide-react";

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          // Move to next phase
          if (phase === "inhale") {
            setPhase("hold");
            return 4;
          } else if (phase === "hold") {
            setPhase("exhale");
            return 6;
          } else {
            setPhase("inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setPhase("inhale");
      setCountdown(4);
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
    }
  };

  const getScaleClass = () => {
    if (!isActive) return "scale-100";
    switch (phase) {
      case "inhale":
        return "scale-150";
      case "hold":
        return "scale-150";
      case "exhale":
        return "scale-100";
    }
  };

  return (
    <Card className="shadow-[var(--shadow-glow)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-5 h-5" />
          Breathing Flow
        </CardTitle>
        <CardDescription>Calm your mind with guided breathing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-6">
          <div
            className={`w-40 h-40 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${getScaleClass()}`}
            style={{
              transitionDuration: phase === "inhale" ? "4000ms" : phase === "hold" ? "4000ms" : "6000ms"
            }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-foreground">{countdown}</div>
              <div className="text-sm text-primary-foreground/80">{getPhaseInstruction()}</div>
            </div>
          </div>
          <Button onClick={handleToggle} className="w-full" size="lg">
            {isActive ? "Stop Exercise" : "Start Breathing"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;

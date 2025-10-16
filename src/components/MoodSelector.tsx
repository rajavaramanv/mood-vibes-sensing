import { cn } from "@/lib/utils";

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  selectedMood: string | null;
}

const moods = [
  { emoji: "😊", label: "Happy", color: "bg-yellow-400 hover:bg-yellow-500" },
  { emoji: "😢", label: "Sad", color: "bg-blue-400 hover:bg-blue-500" },
  { emoji: "😠", label: "Angry", color: "bg-red-400 hover:bg-red-500" },
  { emoji: "😰", label: "Anxious", color: "bg-purple-400 hover:bg-purple-500" },
  { emoji: "😌", label: "Calm", color: "bg-green-400 hover:bg-green-500" },
  { emoji: "😴", label: "Tired", color: "bg-indigo-400 hover:bg-indigo-500" },
];

const MoodSelector = ({ onMoodSelect, selectedMood }: MoodSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {moods.map((mood) => (
        <button
          key={mood.label}
          onClick={() => onMoodSelect(mood.label)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl transition-all",
            mood.color,
            selectedMood === mood.label && "ring-4 ring-primary ring-offset-2",
            "hover:scale-105 active:scale-95"
          )}
        >
          <span className="text-4xl">{mood.emoji}</span>
          <span className="text-sm font-medium text-white">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;

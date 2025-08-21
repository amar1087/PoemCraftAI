import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generatePoemSchema, type GeneratePoemRequest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PoemGeneratorProps {
  onGenerate: (data: GeneratePoemRequest) => void;
  isGenerating: boolean;
  error?: string;
}

const eventTypes = [
  { value: "birthday", label: "Birthday" },
  { value: "wedding", label: "Wedding" },
  { value: "graduation", label: "Graduation" },
  { value: "anniversary", label: "Anniversary" },
  { value: "valentines", label: "Valentine's Day" },
  { value: "mothers-day", label: "Mother's Day" },
  { value: "fathers-day", label: "Father's Day" },
  { value: "friendship", label: "Friendship" },
  { value: "condolence", label: "Condolence" },
  { value: "congratulations", label: "Congratulations" },
  { value: "children", label: "Children's Poems" },
  { value: "learning", label: "Learning Poems" },
];

const childrenThemes = [
  { 
    value: "animals", 
    label: "Animals", 
    multiselect: true,
    options: ["puppy", "kitten", "elephant", "lion", "rabbit", "bear", "monkey", "giraffe", "penguin", "dolphin", "tiger", "zebra", "owl", "fox", "whale"] 
  },
  { 
    value: "toys", 
    label: "Toys", 
    multiselect: true,
    options: ["teddy bear", "doll", "toy car", "blocks", "ball", "train", "puzzle", "robot", "kite", "balloon", "bicycle", "skateboard", "yo-yo", "marbles", "jump rope"] 
  },
  { 
    value: "characters", 
    label: "Characters", 
    multiselect: false,
    options: ["superhero", "princess", "pirate", "fairy", "knight", "astronaut", "dinosaur", "unicorn", "dragon", "mermaid"] 
  },
  { 
    value: "nature", 
    label: "Nature", 
    multiselect: false,
    options: ["rainbow", "sunshine", "flowers", "trees", "ocean", "stars", "moon", "butterflies", "garden", "forest"] 
  },
  { 
    value: "activities", 
    label: "Activities", 
    multiselect: false,
    options: ["playing", "reading", "drawing", "singing", "dancing", "swimming", "running", "jumping", "learning", "exploring"] 
  },
];

const learningTopics = [
  { value: "numbers", label: "Numbers & Counting" },
  { value: "alphabet", label: "Alphabet & Letters" },
  { value: "colors", label: "Colors & Shapes" },
  { value: "seasons", label: "Seasons & Weather" },
  { value: "body-parts", label: "Body Parts" },
  { value: "family", label: "Family & Friends" },
  { value: "emotions", label: "Emotions & Feelings" },
  { value: "safety", label: "Safety Rules" },
  { value: "healthy-habits", label: "Healthy Habits" },
  { value: "good-manners", label: "Good Manners" },
];

const poemStyles = [
  { value: "heartfelt", label: "Heartfelt" },
  { value: "playful", label: "Playful" },
  { value: "elegant", label: "Elegant" },
  { value: "humorous", label: "Humorous" },
];

export default function PoemGenerator({ onGenerate, isGenerating, error }: PoemGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [selectedSpecific, setSelectedSpecific] = useState<string>("");
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  
  const form = useForm<GeneratePoemRequest>({
    resolver: zodResolver(generatePoemSchema),
    defaultValues: {
      eventType: "",
      names: "",
      style: "heartfelt",
      childrenTheme: "",
      childrenOptions: [],
      learningTopic: "",
    },
  });

  const handleSubmit = (data: GeneratePoemRequest) => {
    onGenerate(data);
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    form.setValue("style", style as any);
  };

  const handleEventTypeChange = (eventType: string) => {
    form.setValue("eventType", eventType);
    if (eventType !== "children") {
      setSelectedTheme("");
      setSelectedSpecific("");
      setSelectedMultiple([]);
      form.setValue("childrenTheme", "");
      form.setValue("childrenOptions", []);
    }
    if (eventType !== "learning") {
      form.setValue("learningTopic", "");
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setSelectedSpecific("");
    setSelectedMultiple([]);
    form.setValue("childrenOptions", []);
  };

  const handleSpecificChange = (specific: string) => {
    setSelectedSpecific(specific);
    form.setValue("childrenTheme", `${selectedTheme}-${specific}`);
    form.setValue("childrenOptions", [specific]);
  };

  const handleMultipleChange = (option: string) => {
    const newSelected = selectedMultiple.includes(option)
      ? selectedMultiple.filter(item => item !== option)
      : [...selectedMultiple, option];
    
    setSelectedMultiple(newSelected);
    form.setValue("childrenOptions", newSelected);
    if (newSelected.length > 0) {
      form.setValue("childrenTheme", `${selectedTheme}-multiple`);
    }
  };

  const isChildrenEvent = form.watch("eventType") === "children";
  const isLearningEvent = form.watch("eventType") === "learning";
  const currentTheme = childrenThemes.find(t => t.value === selectedTheme);
  const currentThemeOptions = currentTheme?.options || [];
  const isMultiselect = currentTheme?.multiselect || false;

  return (
    <Card className="h-fit shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold text-slate-800">
          <Wand2 className="mr-3 h-6 w-6 text-primary" />
          Create Your Poem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Event Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="eventType" className="text-sm font-medium text-slate-700">
              Event Type
            </Label>
            <Select
              value={form.watch("eventType")}
              onValueChange={handleEventTypeChange}
            >
              <SelectTrigger className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Select an event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.eventType && (
              <p className="text-sm text-red-500">{form.formState.errors.eventType.message}</p>
            )}
          </div>

          {/* Children's Theme Selection */}
          {isChildrenEvent && (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Choose Theme
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {childrenThemes.map((theme) => (
                    <Button
                      key={theme.value}
                      type="button"
                      variant="outline"
                      className={cn(
                        "px-3 py-2 text-sm transition-colors rounded-lg",
                        selectedTheme === theme.value
                          ? "bg-secondary text-white border-secondary"
                          : "bg-slate-100 hover:bg-secondary hover:text-white border-slate-200"
                      )}
                      onClick={() => handleThemeChange(theme.value)}
                    >
                      {theme.label}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedTheme && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    {isMultiselect ? `Choose Multiple ${currentTheme?.label} (select as many as you want)` : `Choose Specific ${currentTheme?.label}`}
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {currentThemeOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant="outline"
                        className={cn(
                          "px-3 py-2 text-sm transition-colors rounded-lg text-left justify-start",
                          isMultiselect 
                            ? (selectedMultiple.includes(option)
                                ? "bg-accent text-white border-accent"
                                : "bg-slate-100 hover:bg-accent hover:text-white border-slate-200")
                            : (selectedSpecific === option
                                ? "bg-accent text-white border-accent"
                                : "bg-slate-100 hover:bg-accent hover:text-white border-slate-200")
                        )}
                        onClick={() => isMultiselect ? handleMultipleChange(option) : handleSpecificChange(option)}
                      >
                        {isMultiselect && selectedMultiple.includes(option) && "✓ "}
                        {option}
                      </Button>
                    ))}
                  </div>
                  {isMultiselect && selectedMultiple.length > 0 && (
                    <p className="text-sm text-primary font-medium">
                      Selected: {selectedMultiple.join(", ")} ({selectedMultiple.length} items)
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Learning Topics Selection */}
          {isLearningEvent && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Choose Learning Topic
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {learningTopics.map((topic) => (
                  <Button
                    key={topic.value}
                    type="button"
                    variant="outline"
                    className={cn(
                      "px-3 py-2 text-sm transition-colors rounded-lg text-left justify-start",
                      form.watch("learningTopic") === topic.value
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-slate-100 hover:bg-green-500 hover:text-white border-slate-200"
                    )}
                    onClick={() => form.setValue("learningTopic", topic.value)}
                  >
                    {topic.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Names Input */}
          <div className="space-y-2">
            <Label htmlFor="names" className="text-sm font-medium text-slate-700">
              {isChildrenEvent || isLearningEvent ? "Child's Name (optional)" : "Names (optional)"}
            </Label>
            <Input
              id="names"
              placeholder={
                isChildrenEvent || isLearningEvent 
                  ? "Enter child's name" 
                  : "Enter names to personalize the poem"
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              {...form.register("names")}
            />
            <p className="text-sm text-slate-500">
              {isChildrenEvent || isLearningEvent 
                ? "Make it personal with the child's name" 
                : "Separate multiple names with commas"}
            </p>
          </div>

          {/* Poem Style Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Poem Style
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {poemStyles.map((style) => (
                <Button
                  key={style.value}
                  type="button"
                  variant="outline"
                  className={cn(
                    "px-4 py-2 text-sm transition-colors rounded-lg",
                    selectedStyle === style.value
                      ? "bg-primary text-white border-primary"
                      : "bg-slate-100 hover:bg-primary hover:text-white border-slate-200"
                  )}
                  onClick={() => handleStyleSelect(style.value)}
                >
                  {style.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                AI is crafting your poem...
              </div>
            ) : (
              <div className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Poem
              </div>
            )}
          </Button>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-500 mr-2">⚠️</div>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

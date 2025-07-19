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
];

const poemStyles = [
  { value: "heartfelt", label: "Heartfelt" },
  { value: "playful", label: "Playful" },
  { value: "elegant", label: "Elegant" },
  { value: "humorous", label: "Humorous" },
];

export default function PoemGenerator({ onGenerate, isGenerating, error }: PoemGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  
  const form = useForm<GeneratePoemRequest>({
    resolver: zodResolver(generatePoemSchema),
    defaultValues: {
      eventType: "",
      names: "",
      style: "heartfelt",
    },
  });

  const handleSubmit = (data: GeneratePoemRequest) => {
    onGenerate(data);
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    form.setValue("style", style as any);
  };

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
              onValueChange={(value) => form.setValue("eventType", value)}
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

          {/* Names Input */}
          <div className="space-y-2">
            <Label htmlFor="names" className="text-sm font-medium text-slate-700">
              Names (optional)
            </Label>
            <Input
              id="names"
              placeholder="Enter names to personalize the poem"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              {...form.register("names")}
            />
            <p className="text-sm text-slate-500">
              Separate multiple names with commas
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

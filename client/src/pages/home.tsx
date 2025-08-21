import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Feather } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PoemGenerator from "@/components/poem-generator";
import PoemDisplay from "@/components/poem-display";
import RecentPoems from "@/components/recent-poems";
import type { GeneratePoemRequest, Poem } from "@shared/schema";

export default function Home() {
  const [currentPoem, setCurrentPoem] = useState<Poem | undefined>();
  const [lastGenerationRequest, setLastGenerationRequest] = useState<GeneratePoemRequest | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generatePoemMutation = useMutation({
    mutationFn: async (data: GeneratePoemRequest) => {
      const res = await apiRequest("POST", "/api/poems/generate", data);
      return res.json();
    },
    onSuccess: (poem: Poem) => {
      setCurrentPoem(poem);
      queryClient.invalidateQueries({ queryKey: ["/api/poems/recent"] });
      toast({
        title: "Poem Generated!",
        description: "Your personalized poem is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate poem. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = (data: GeneratePoemRequest) => {
    setLastGenerationRequest(data);
    generatePoemMutation.mutate(data);
  };

  const handleRegenerate = () => {
    if (lastGenerationRequest) {
      generatePoemMutation.mutate(lastGenerationRequest);
    }
  };

  const handleSave = () => {
    if (currentPoem) {
      const blob = new Blob([currentPoem.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `poem-${currentPoem.eventType}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Poem Saved!",
        description: "Your poem has been downloaded.",
      });
    }
  };

  const handlePoemSelect = (poem: Poem) => {
    setCurrentPoem(poem);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-6">
            <Feather className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Poem<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Craft</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Create beautiful, personalized poems for any occasion using the power of artificial intelligence
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-12">
        {/* Poem Generator */}
        <div className="grid lg:grid-cols-2 gap-8">
          <PoemGenerator
            onGenerate={handleGenerate}
            isGenerating={generatePoemMutation.isPending}
            error={generatePoemMutation.error?.message}
          />
          
          <PoemDisplay
            poem={currentPoem}
            isLoading={generatePoemMutation.isPending}
            onRegenerate={handleRegenerate}
            onSave={handleSave}
          />
        </div>

        {/* Recent Poems */}
        <div className="mt-12">
          <RecentPoems onPoemSelect={handlePoemSelect} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-3">
                <Feather className="text-white text-sm" />
              </div>
              <span className="text-slate-600 font-medium">PoemCraft</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-500">
              <span className="text-sm">Powered by OpenAI GPT-4o</span>
              <span className="text-sm">•</span>
              <span className="text-sm">AI Poetry Generation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

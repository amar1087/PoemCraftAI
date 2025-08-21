import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scroll, Copy, RotateCcw, Download, Feather } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Poem } from "@shared/schema";

interface PoemDisplayProps {
  poem?: Poem;
  isLoading?: boolean;
  onRegenerate?: () => void;
  onSave?: () => void;
}

export default function PoemDisplay({ poem, isLoading, onRegenerate, onSave }: PoemDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!poem) return;
    
    try {
      await navigator.clipboard.writeText(poem.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Poem copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy poem",
        variant: "destructive",
      });
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatStyle = (style: string) => {
    return style.charAt(0).toUpperCase() + style.slice(1);
  };

  const renderPoemContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <p key={index} className={cn(
        "leading-relaxed",
        line.trim() === "" ? "mb-4" : "mb-1"
      )}>
        {line || <br />}
      </p>
    ));
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold text-slate-800">
          <Scroll className="mr-3 h-6 w-6 text-secondary" />
          Your Poem
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mr-3"></div>
            <span className="text-slate-700">AI is crafting your poem...</span>
          </div>
        ) : poem ? (
          <div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center flex-wrap gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {formatEventType(poem.eventType)} Poem
                  </Badge>
                  {poem.eventType === "children" && poem.childrenOptions && poem.childrenOptions.length > 0 && (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                      {poem.childrenOptions.join(', ')}
                    </Badge>
                  )}
                  {poem.eventType === "learning" && poem.learningTopic && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                      {poem.learningTopic.replace('-', ' ')}
                    </Badge>
                  )}
                  <span className="text-slate-400 text-sm">
                    {formatStyle(poem.style)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-primary transition-colors"
                  title="Copy poem"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="font-serif text-slate-800 text-lg space-y-1">
                {renderPoemContent(poem.content)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onRegenerate}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button
                onClick={onSave}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all"
              >
                <Download className="mr-2 h-4 w-4" />
                Save Poem
              </Button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
              <Feather className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg mb-2">No poem generated yet</p>
            <p className="text-slate-400">
              Fill out the form and click generate to create your personalized poem
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

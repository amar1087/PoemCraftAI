import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Poem } from "@shared/schema";

interface RecentPoemsProps {
  onPoemSelect?: (poem: Poem) => void;
}

export default function RecentPoems({ onPoemSelect }: RecentPoemsProps) {
  const { data: poems, isLoading } = useQuery<Poem[]>({
    queryKey: ["/api/poems/recent"],
    queryFn: async () => {
      const res = await fetch("/api/poems/recent");
      if (!res.ok) throw new Error("Failed to fetch recent poems");
      return res.json();
    },
  });

  const formatEventType = (eventType: string) => {
    return eventType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getEventTypeColor = (eventType: string) => {
    const colors = {
      birthday: "bg-accent/10 text-accent",
      wedding: "bg-pink-100 text-pink-700",
      graduation: "bg-secondary/10 text-secondary",
      anniversary: "bg-primary/10 text-primary",
      valentines: "bg-red-100 text-red-700",
      "mothers-day": "bg-pink-100 text-pink-700",
      "fathers-day": "bg-blue-100 text-blue-700",
      friendship: "bg-yellow-100 text-yellow-700",
      condolence: "bg-gray-100 text-gray-700",
      congratulations: "bg-green-100 text-green-700",
      children: "bg-orange-100 text-orange-700",
      learning: "bg-green-100 text-green-700",
    };
    return colors[eventType as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const truncatePoem = (content: string, maxLength: number = 80) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const firstTwoLines = lines.slice(0, 2).join('\n');
    return firstTwoLines.length > maxLength 
      ? firstTwoLines.slice(0, maxLength) + '...'
      : firstTwoLines;
  };

  if (isLoading) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-semibold text-slate-800">
            <History className="mr-3 h-6 w-6 text-cyan-500" />
            Recent Poems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="mt-4 h-4 w-24 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold text-slate-800">
          <History className="mr-3 h-6 w-6 text-cyan-500" />
          Recent Poems
        </CardTitle>
      </CardHeader>
      <CardContent>
        {poems && poems.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {poems.map((poem) => (
              <div
                key={poem.id}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onPoemSelect?.(poem)}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getEventTypeColor(poem.eventType)}>
                    {formatEventType(poem.eventType)}
                  </Badge>
                  <span className="text-slate-400 text-sm">
                    {formatDistanceToNow(new Date(poem.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="font-serif text-slate-700 text-sm leading-relaxed mb-4">
                  {truncatePoem(poem.content).split('\n').map((line, index) => (
                    <p key={index} className="mb-1">
                      {line.startsWith('"') && line.endsWith('"') ? line : `"${line}`}
                      {index === 0 && !line.endsWith('"') && '...'}
                    </p>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-secondary transition-colors text-sm font-medium p-0"
                >
                  View full poem
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-4">
              <History className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg mb-2">No recent poems</p>
            <p className="text-slate-400">
              Generate your first poem to see it here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

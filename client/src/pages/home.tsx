import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Target, Clock, Crosshair, Smartphone, Copy, Check, Loader2 } from "lucide-react";
import { GOAL_OPTIONS, PLATFORM_OPTIONS, TIME_OPTIONS, type GeneratedMission } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [timeMinutes, setTimeMinutes] = useState<number | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: missionCount = 0 } = useQuery<number>({
    queryKey: ["/api/missions/count"],
  });

  const { data: currentMission, isLoading: missionLoading } = useQuery<GeneratedMission | null>({
    queryKey: ["/api/missions/current"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { timeMinutes: number; goal: string; platform: string }) => {
      const response = await apiRequest("POST", "/api/missions/generate", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/missions/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/missions/count"] });
      toast({
        title: "Mission Generated",
        description: "Your daily mission is ready. Execute with precision.",
      });
    },
    onError: () => {
      toast({
        title: "Mission Failed",
        description: "Could not generate mission. Try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!timeMinutes || !goal || !platform) {
      toast({
        title: "Incomplete Intel",
        description: "Select your time, goal, and platform to proceed.",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate({ timeMinutes, goal, platform });
  };

  const copyToClipboard = async () => {
    if (currentMission?.missionText) {
      await navigator.clipboard.writeText(currentMission.missionText);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Mission copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormComplete = timeMinutes && goal && platform;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <Badge variant="secondary" className="mb-4" data-testid="badge-mission-count">
          <Target className="w-3 h-3 mr-1" />
          Mission #{missionCount + 1} Today
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" data-testid="text-hero-title">
          Daily Mission Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select your available time, goal, and platform. Receive your mission. Execute.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Crosshair className="w-5 h-5 text-primary" />
            Mission Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Available Time
              </label>
              <Select
                value={timeMinutes?.toString() || ""}
                onValueChange={(value) => setTimeMinutes(parseInt(value))}
              >
                <SelectTrigger data-testid="select-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Your Goal
              </label>
              <Select value={goal || ""} onValueChange={setGoal}>
                <SelectTrigger data-testid="select-goal">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                Platform
              </label>
              <Select value={platform || ""} onValueChange={setPlatform}>
                <SelectTrigger data-testid="select-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!isFormComplete || generateMutation.isPending}
            className="w-full"
            size="lg"
            data-testid="button-generate-mission"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Mission...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Generate Mission
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {(currentMission || missionLoading) && (
        <Card className="border-primary/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Crosshair className="w-5 h-5 text-primary" />
                Your Mission
              </CardTitle>
              {currentMission && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="font-mono">
                    {currentMission.timeMinutes} min
                  </Badge>
                  <Badge variant="secondary">
                    {PLATFORM_OPTIONS.find(p => p.value === currentMission.platform)?.label || currentMission.platform}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {missionLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : currentMission ? (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-md p-6 border border-border">
                  <pre className="text-base leading-relaxed whitespace-pre-wrap font-sans" data-testid="text-mission">
                    {currentMission.missionText}
                  </pre>
                </div>
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="w-full sm:w-auto"
                  data-testid="button-copy-mission"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Mission
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active mission. Generate one above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!currentMission && !missionLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ready for Your Mission?</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select your parameters above and click "Generate Mission" to receive your daily objective.
          </p>
        </div>
      )}
    </div>
  );
}

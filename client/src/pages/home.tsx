import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Target, Crosshair, Smartphone, Copy, Check, Loader2, MessageSquare, Pen, History, Edit3, Calendar } from "lucide-react";
import { PLATFORM_OPTIONS, STYLE_OPTIONS, type GeneratedMission } from "@shared/schema";

function formatDate(dateString: string): string {
  if (!dateString) return "Today";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getContentPreview(missionText: string): string {
  const lines = missionText.split('\n').filter(line => line.trim());
  const missionLine = lines.find(line => line.startsWith('MISSION:'));
  if (missionLine) {
    const content = missionLine.replace('MISSION:', '').trim();
    return content.length > 60 ? content.substring(0, 60) + '...' : content;
  }
  return lines[0]?.substring(0, 60) + '...' || 'Mission content';
}

export default function Home() {
  const { toast } = useToast();
  const [platform, setPlatform] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [style, setStyle] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedHistoryMission, setSelectedHistoryMission] = useState<GeneratedMission | null>(null);

  const { data: missionCount = 0 } = useQuery<number>({
    queryKey: ["/api/missions/count"],
  });

  const { data: currentMission, isLoading: missionLoading } = useQuery<GeneratedMission | null>({
    queryKey: ["/api/missions/current"],
  });

  const { data: missionHistory = [] } = useQuery<GeneratedMission[]>({
    queryKey: ["/api/missions/history"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { platform: string; topic: string; style: string }) => {
      const response = await apiRequest("POST", "/api/missions/generate", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/missions/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/missions/count"] });
      queryClient.invalidateQueries({ queryKey: ["/api/missions/history"] });
      setSelectedHistoryMission(null);
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
    if (!platform || !topic.trim() || !style) {
      toast({
        title: "Incomplete Intel",
        description: "Fill in all fields to proceed.",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate({ platform, topic: topic.trim(), style });
  };

  const displayedMission = selectedHistoryMission || currentMission;

  const copyToClipboard = async (missionText?: string) => {
    const textToCopy = missionText || displayedMission?.missionText;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Mission copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEditMission = (mission: GeneratedMission) => {
    setSelectedHistoryMission(mission);
    if (mission.topic) {
      setTopic(mission.topic);
    }
    if (mission.platform) {
      setPlatform(mission.platform);
    }
  };

  const isFormComplete = platform && topic.trim() && style;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" data-testid="text-hero-title">
          Attention Ops
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Type in a topic and AI will generate a thread using a viral format for your social media.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Pen className="w-4 h-4 text-muted-foreground" />
                Writing Style
              </label>
              <Select value={style || ""} onValueChange={setStyle}>
                <SelectTrigger data-testid="select-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Topic
            </label>
            <Input
              placeholder="e.g., Building online income, Networking tips, First 90 days in business"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              data-testid="input-topic"
            />
            <p className="text-xs text-muted-foreground">
              Type your idea, not your hook. The generator writes the hook for you.
            </p>
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

      {/* Mission Display */}
      {(displayedMission || missionLoading) && (
        <Card className="border-primary/50 mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Crosshair className="w-5 h-5 text-primary" />
                {selectedHistoryMission ? "Previous Mission" : "Your Mission"}
              </CardTitle>
              {displayedMission && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedHistoryMission && (
                    <Badge variant="outline" className="font-mono">
                      #{displayedMission.missionNumber}
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {PLATFORM_OPTIONS.find(p => p.value === displayedMission.platform)?.label || displayedMission.platform}
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
            ) : displayedMission ? (
              <div className="space-y-4">
                <ScrollArea className="h-[300px]">
                  <div className="bg-muted/50 rounded-md p-6 border border-border">
                    <pre className="text-base leading-relaxed whitespace-pre-wrap font-sans" data-testid="text-mission">
                      {displayedMission.missionText}
                    </pre>
                  </div>
                </ScrollArea>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard()}
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
                  {selectedHistoryMission && (
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedHistoryMission(null)}
                      data-testid="button-back-to-current"
                    >
                      Back to Current Mission
                    </Button>
                  )}
                </div>
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

      {/* Mission History */}
      {missionHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="w-4 h-4 text-primary" />
              Mission History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px]" data-testid="scroll-mission-history">
              <div className="px-4 pb-4">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-2 py-2 px-3 text-xs font-medium text-muted-foreground border-b border-border mb-2">
                  <div className="col-span-3">Topic</div>
                  <div className="col-span-5">Content Preview</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                
                {/* Mission Rows */}
                <div className="space-y-1">
                  {missionHistory.map((mission) => (
                    <div
                      key={mission.id}
                      className={`grid grid-cols-12 gap-2 py-3 px-3 rounded-md border transition-colors items-center ${
                        selectedHistoryMission?.id === mission.id
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/30 border-border hover-elevate"
                      }`}
                      data-testid={`row-history-mission-${mission.id}`}
                    >
                      {/* Topic */}
                      <div className="col-span-3">
                        <p className="text-sm font-medium truncate" title={mission.topic || "General"}>
                          {mission.topic || "General"}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {PLATFORM_OPTIONS.find(p => p.value === mission.platform)?.label || mission.platform}
                        </Badge>
                      </div>
                      
                      {/* Content Preview */}
                      <button
                        onClick={() => setSelectedHistoryMission(
                          selectedHistoryMission?.id === mission.id ? null : mission
                        )}
                        className="col-span-5 text-left"
                        data-testid={`button-preview-mission-${mission.id}`}
                      >
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {getContentPreview(mission.missionText)}
                        </p>
                      </button>
                      
                      {/* Date */}
                      <div className="col-span-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(mission.createdAt)}
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(mission.missionText);
                          }}
                          data-testid={`button-copy-history-${mission.id}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMission(mission);
                          }}
                          data-testid={`button-edit-history-${mission.id}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {!displayedMission && !missionLoading && missionHistory.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ready for Your Mission?</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Fill in your parameters above and click "Generate Mission" to receive your daily objective.
          </p>
        </div>
      )}

      {/* Affiliate Box */}
      <Card className="mt-8 border-primary/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold mb-1">Earn Money as a Mission Generator Affiliate</h3>
              <p className="text-sm text-muted-foreground">
                Share Vet2Ceo with fellow veterans and earn 50% commission on every referral.
              </p>
            </div>
            <Button
              variant="default"
              onClick={() => window.open('https://vet2ceo.com/affiliate?ref=mission-generator&commission=50', '_blank')}
              data-testid="button-become-affiliate"
            >
              Become an Affiliate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

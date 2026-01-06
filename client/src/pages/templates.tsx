import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Clock,
  Briefcase,
  Dumbbell,
  BookOpen,
  Users,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { CATEGORY_OPTIONS, type MissionTemplate } from "@shared/schema";

const categoryIcons: Record<string, typeof Briefcase> = {
  business: Briefcase,
  fitness: Dumbbell,
  learning: BookOpen,
  networking: Users,
};

export default function Templates() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<MissionTemplate | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: templates = [], isLoading } = useQuery<MissionTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const filteredTemplates = selectedCategory
    ? templates.filter((t) => t.category === selectedCategory)
    : templates;

  const copyTemplate = async (template: MissionTemplate) => {
    await navigator.clipboard.writeText(template.missionText);
    setCopied(true);
    toast({
      title: "Template Copied",
      description: "Mission template copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" data-testid="text-templates-title">
          Template Library
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Pre-built mission templates for every goal. Pick one and start executing.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          data-testid="button-filter-all"
        >
          All
        </Button>
        {CATEGORY_OPTIONS.map((category) => {
          const Icon = categoryIcons[category.value] || FileText;
          return (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              data-testid={`button-filter-${category.value}`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
          <p className="text-muted-foreground">
            {selectedCategory
              ? "No templates in this category yet."
              : "Templates will appear here soon."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = categoryIcons[template.category] || FileText;
            return (
              <Card
                key={template.id}
                className="flex flex-col"
                data-testid={`card-template-${template.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">
                      {template.title}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      <Icon className="w-3 h-3 mr-1" />
                      {CATEGORY_OPTIONS.find((c) => c.value === template.category)?.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.timeMinutes} min
                    </span>
                    <span className="capitalize">{template.platform}</span>
                  </div>
                </CardContent>
                <CardFooter className="gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setPreviewTemplate(template)}
                    data-testid={`button-preview-${template.id}`}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => copyTemplate(template)}
                    data-testid={`button-use-${template.id}`}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          {previewTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = categoryIcons[previewTemplate.category] || FileText;
                    return <Icon className="w-5 h-5 text-primary" />;
                  })()}
                  {previewTemplate.title}
                </DialogTitle>
                <DialogDescription>{previewTemplate.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">
                    {CATEGORY_OPTIONS.find((c) => c.value === previewTemplate.category)?.label}
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    {previewTemplate.timeMinutes} min
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {previewTemplate.platform}
                  </Badge>
                </div>
                <div className="bg-muted/50 rounded-md p-6 border border-border">
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                    Mission Template:
                  </h4>
                  <p className="text-base leading-relaxed">{previewTemplate.missionText}</p>
                </div>
                <Button
                  onClick={() => {
                    copyTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="w-full"
                  data-testid="button-use-template-modal"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy & Use This Template
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

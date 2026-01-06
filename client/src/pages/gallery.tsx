import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Image as ImageIcon, Award, Building2, User } from "lucide-react";
import { type Photo } from "@shared/schema";

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const { data: photos = [], isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" data-testid="text-gallery-title">
          Success Gallery
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Veterans who completed their missions and built successful businesses.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Gallery Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Veteran success stories will be featured here. Check back soon for inspiring journeys.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card
              key={photo.id}
              className="overflow-hidden group cursor-pointer hover-elevate"
              onClick={() => setSelectedPhoto(photo)}
              data-testid={`card-photo-${photo.id}`}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.veteranName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold">{photo.veteranName}</p>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {photo.missionAccomplished}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{photo.veteranName}</span>
                </div>
                {photo.businessName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{photo.businessName}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {selectedPhoto && (
            <div>
              <div className="relative aspect-video sm:aspect-[4/3] overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.veteranName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-xl font-bold" data-testid="text-photo-name">
                      {selectedPhoto.veteranName}
                    </h3>
                    {selectedPhoto.businessName && (
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {selectedPhoto.businessName}
                      </p>
                    )}
                  </div>
                  <Badge className="shrink-0">
                    <Award className="w-3 h-3 mr-1" />
                    Mission Complete
                  </Badge>
                </div>
                <div className="bg-muted/50 rounded-md p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Mission Accomplished:</p>
                  <p className="font-medium">{selectedPhoto.missionAccomplished}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import type { PlantPhoto } from "@/features/photos/types/photoTypes";
import { PhotoCard } from "@/features/photos/components/PhotoCard";

type PhotosGridProps = {
    photos: PlantPhoto[];
    isMutating?: boolean;
    onOpen: (photoId: number) => void;
    onDelete: (photoId: number) => void;
};

export function PhotosGrid({
    photos,
    isMutating = false,
    onOpen,
    onDelete
}: PhotosGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {photos.map((photo) => (
                <PhotoCard
                    key={photo.id}
                    photo={photo}
                    isMutating={isMutating}
                    onOpen={onOpen}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
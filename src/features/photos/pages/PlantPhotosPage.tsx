import { Camera } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";
import { Button } from "@/shared/components/ui/button";

export function PlantPhotosPage() {
    const { plantId } = useParams();

    return (
        <>
            <PageHeader
                eyebrow="Fotos"
                title={`Fotos da planta ${plantId ?? ""}`}
                description="Upload, listagem, download e remoção de fotos entram no Bloco 8."
                actions={
                    <Button asChild variant="outline">
                        <Link to={`/app/plants/${plantId ?? "1"}`}>Voltar para planta</Link>
                    </Button>
                }
            />

            <RoutePlaceholder
                icon={<Camera className="h-5 w-5" />}
                title="Fotos preparadas"
                description="A tela está pronta para receber upload multipart/form-data e galeria protegida."
                bullets={[
                    "GET /plants/{plantId}/photos",
                    "POST /plants/{plantId}/photos",
                    "DELETE /plants/{plantId}/photos/{photoId}",
                    "GET /plants/{plantId}/photos/{photoId}/download"
                ]}
            />
        </>
    );
}
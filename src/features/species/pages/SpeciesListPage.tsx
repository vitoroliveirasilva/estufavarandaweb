import { Leaf } from "lucide-react";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";

export function SpeciesListPage() {
    return (
        <>
            <PageHeader
                eyebrow="Espécies"
                title="Catálogo de espécies"
                description="Listagem de espécies fica preparada para entrar no Bloco 7."
            />

            <RoutePlaceholder
                icon={<Leaf className="h-5 w-5" />}
                title="Espécies preparadas"
                description="O catálogo será usado para consulta e associação futura com plantas."
                bullets={[
                    "GET /species?page=1&page_size=20&active_only=true",
                    "GET /species/{speciesId}",
                    "POST /species apenas admin",
                    "PATCH /species/{speciesId} apenas admin"
                ]}
            />
        </>
    );
}
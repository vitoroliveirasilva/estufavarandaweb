import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";
import { Button } from "@/shared/components/ui/button";

export function PlantsListPage() {
    return (
        <>
            <PageHeader
                eyebrow="Plantas"
                title="Minhas plantas"
                description="Listagem com paginação, filtros e busca será conectada ao endpoint GET /plants no Bloco 5."
                actions={
                    <Button asChild>
                        <Link to="/app/plants/new">Cadastrar planta</Link>
                    </Button>
                }
            />

            <RoutePlaceholder
                icon={<Sprout className="h-5 w-5" />}
                title="Lista de plantas preparada"
                description="A tela já existe no router e está pronta para receber TanStack Query, filtros e cards de plantas."
                bullets={[
                    "GET /plants?page=1&page_size=20",
                    "Filtros por busca, saúde, espécie e arquivadas",
                    "Estados de loading, erro e vazio",
                    "Ação de arquivar via DELETE /plants/{plantId}"
                ]}
            />
        </>
    );
}
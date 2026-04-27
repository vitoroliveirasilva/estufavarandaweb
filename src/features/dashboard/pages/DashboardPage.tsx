import { Bell, CloudSun, Leaf, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

const cards = [
    {
        title: "Plantas",
        description: "Listagem, criação, edição e arquivamento no Bloco 5.",
        icon: Sprout,
        to: "/app/plants"
    },
    {
        title: "Regas",
        description: "Histórico e criação de registros no Bloco 6.",
        icon: Leaf,
        to: "/app/plants/1/watering"
    },
    {
        title: "Clima",
        description: "Resumo climático e histórico por planta no Bloco 7.",
        icon: CloudSun,
        to: "/app/plants/1/climate"
    },
    {
        title: "Notificações",
        description: "Listar, ler e descartar notificações no Bloco 7.",
        icon: Bell,
        to: "/app/notifications"
    }
];

export function DashboardPage() {
    return (
        <>
            <PageHeader
                eyebrow="Home"
                title="Dashboard"
                description="Visão inicial do site web da Estufa da Varanda. Os cards já deixam o caminho pronto para os próximos blocos."
                actions={
                    <Button asChild>
                        <Link to="/app/plants/new">Nova planta</Link>
                    </Button>
                }
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Card key={card.title}>
                            <CardHeader>
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <CardTitle>{card.title}</CardTitle>
                                <CardDescription className="leading-6">
                                    {card.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline" className="w-full">
                                    <Link to={card.to}>Abrir</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
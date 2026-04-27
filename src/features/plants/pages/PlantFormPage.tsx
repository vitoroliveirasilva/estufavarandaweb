import { type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type PlantFormPageProps = {
    mode: "create" | "edit";
};

export function PlantFormPage({ mode }: PlantFormPageProps) {
    const { plantId } = useParams();
    const isEdit = mode === "edit";

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <>
            <PageHeader
                eyebrow={isEdit ? "Editar planta" : "Nova planta"}
                title={isEdit ? `Editar planta ${plantId ?? ""}` : "Cadastrar planta"}
                description="Formulário visual inicial. Schemas Zod, React Hook Form e integração entram no Bloco 5."
                actions={
                    <Button asChild variant="outline">
                        <Link to={isEdit ? `/app/plants/${plantId ?? "1"}` : "/app/plants"}>
                            Cancelar
                        </Link>
                    </Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Dados principais</CardTitle>
                    <CardDescription>
                        Campos alinhados com o contrato de criação e atualização de plantas.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" name="name" placeholder="Roseira" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nickname">Apelido</Label>
                            <Input id="nickname" name="nickname" placeholder="Rosinha" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="healthStatus">Status de saúde</Label>
                            <Input
                                id="healthStatus"
                                name="health_status"
                                placeholder="attention"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="environment">Ambiente</Label>
                            <Input id="environment" name="environment" placeholder="outdoor" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lightExposure">Exposição de luz</Label>
                            <Input
                                id="lightExposure"
                                name="light_exposure"
                                placeholder="afternoon_sun"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ventilation">Ventilação</Label>
                            <Input id="ventilation" name="ventilation" placeholder="airy" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="locationLabel">Local</Label>
                            <Input id="locationLabel" name="location_label" placeholder="Varanda" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cityName">Cidade</Label>
                            <Input id="cityName" name="city_name" placeholder="Jundiaí" />
                        </div>

                        <div className="flex justify-end md:col-span-2">
                            <Button type="submit">
                                {isEdit ? "Salvar alterações" : "Cadastrar planta"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
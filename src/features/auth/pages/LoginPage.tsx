import { type FormEvent } from "react";
import { Link } from "react-router-dom";

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

export function LoginPage() {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>
                    A autenticação real entra no Bloco 3. Esta tela já fica posicionada
                    para receber React Hook Form e Zod.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="usuario@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Sua senha"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Entrar
                    </Button>

                    <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                        <Link className="text-primary hover:underline" to="/forgot-password">
                            Esqueci minha senha
                        </Link>
                        <Link className="text-primary hover:underline" to="/app">
                            Entrar no layout de desenvolvimento
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
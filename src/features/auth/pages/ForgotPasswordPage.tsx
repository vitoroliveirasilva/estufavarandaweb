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

export function ForgotPasswordPage() {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recuperar senha</CardTitle>
                <CardDescription>
                    A mensagem de retorno será sempre genérica para não revelar se o
                    e-mail existe ou não.
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

                    <Button type="submit" className="w-full">
                        Enviar instruções
                    </Button>

                    <div className="text-center text-sm">
                        <Link className="text-primary hover:underline" to="/login">
                            Voltar para login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
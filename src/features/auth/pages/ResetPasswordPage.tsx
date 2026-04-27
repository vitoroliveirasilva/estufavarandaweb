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

export function ResetPasswordPage() {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Redefinir senha</CardTitle>
                <CardDescription>
                    Validações de token, senha mínima e confirmação entram no bloco de
                    autenticação.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="token">Token</Label>
                        <Input id="token" name="token" placeholder="TOKEN_AQUI" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova senha</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Mínimo de 8 caracteres"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Repita a senha"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Redefinir senha
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
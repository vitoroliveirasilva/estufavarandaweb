import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquareText } from "lucide-react";

import type { AiConversation } from "@/features/ai/types/aiTypes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type AiConversationsListProps = {
    conversations: AiConversation[];
};

function formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

export function AiConversationsList({
    conversations
}: AiConversationsListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Conversas de IA</CardTitle>
                <CardDescription>
                    Histórico de conversas registradas para esta planta.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {conversations.map((conversation) => (
                    <article
                        key={conversation.id}
                        className="flex gap-4 rounded-2xl border bg-background p-4"
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                            <MessageSquareText className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-medium">{conversation.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Criada em {formatDateTime(conversation.created_at)}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Atualizada em {formatDateTime(conversation.updated_at)}
                            </p>
                        </div>
                    </article>
                ))}
            </CardContent>
        </Card>
    );
}
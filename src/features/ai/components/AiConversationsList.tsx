import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquareText } from "lucide-react";

import type { AiConversation } from "@/features/ai/types/aiTypes";
import { EmptyState } from "@/shared/components/EmptyState";
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
    if (!value) {
        return "Não informado";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

function getConversationTitle(conversation: AiConversation): string {
    const title = conversation.title.trim();
    return title.length > 0 ? title : `Conversa #${conversation.id}`;
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

            <CardContent>
                {conversations.length === 0 ? (
                    <EmptyState
                        icon={<MessageSquareText className="h-6 w-6" />}
                        title="Nenhuma conversa registrada"
                        description="Quando a API retornar conversas de IA, elas aparecerão aqui."
                    />
                ) : (
                    <ul className="space-y-3" aria-label="Conversas de IA da planta">
                        {conversations.map((conversation) => (
                            <li key={conversation.id}>
                                <article className="flex gap-4 rounded-2xl border bg-background p-4">
                                    <div
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary"
                                        aria-hidden="true"
                                    >
                                        <MessageSquareText className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-medium">
                                            {getConversationTitle(conversation)}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Criada em {formatDateTime(conversation.created_at)}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Atualizada em {formatDateTime(conversation.updated_at)}
                                        </p>
                                    </div>
                                </article>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
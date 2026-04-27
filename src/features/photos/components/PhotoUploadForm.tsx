import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";

import {
    defaultPhotoUploadFormValues,
    photoUploadSchema,
    type PhotoUploadFormValues
} from "@/features/photos/schemas/photoSchemas";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
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

type PhotoUploadFormProps = {
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: PhotoUploadFormValues) => Promise<void> | void;
};

export function PhotoUploadForm({
    isSubmitting = false,
    apiErrorMessage,
    onSubmit
}: PhotoUploadFormProps) {
    const form = useForm<PhotoUploadFormValues>({
        resolver: zodResolver(photoUploadSchema),
        defaultValues: defaultPhotoUploadFormValues
    });

    const disabled = isSubmitting || form.formState.isSubmitting;

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);
        form.reset(defaultPhotoUploadFormValues);
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enviar foto</CardTitle>
                <CardDescription>
                    O upload usa multipart/form-data com arquivo, tipo, legenda, notas e
                    data opcional.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2">
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="photo-file">Arquivo *</Label>
                        <Input
                            id="photo-file"
                            type="file"
                            accept="image/*"
                            disabled={disabled}
                            {...form.register("file")}
                        />
                        <FormErrorMessage message={form.formState.errors.file?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="photo_type">Tipo</Label>
                        <Input
                            id="photo_type"
                            placeholder="routine"
                            disabled={disabled}
                            {...form.register("photo_type")}
                        />
                        <FormErrorMessage message={form.formState.errors.photo_type?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="taken_at">Tirada em</Label>
                        <Input
                            id="taken_at"
                            type="datetime-local"
                            disabled={disabled}
                            {...form.register("taken_at")}
                        />
                        <FormErrorMessage message={form.formState.errors.taken_at?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="caption">Legenda</Label>
                        <Input
                            id="caption"
                            placeholder="Registro visual"
                            disabled={disabled}
                            {...form.register("caption")}
                        />
                        <FormErrorMessage message={form.formState.errors.caption?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="photo-notes">Notas</Label>
                        <textarea
                            id="photo-notes"
                            rows={4}
                            placeholder="Upload via web, folha nova, praga visível..."
                            disabled={disabled}
                            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("notes")}
                        />
                        <FormErrorMessage message={form.formState.errors.notes?.message} />
                    </div>

                    <div className="flex justify-end md:col-span-2">
                        <Button type="submit" disabled={disabled}>
                            {disabled ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Enviar foto
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
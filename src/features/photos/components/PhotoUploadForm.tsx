import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
    defaultPhotoUploadFormValues,
    PHOTO_ACCEPT_ATTRIBUTE,
    PHOTO_MAX_FILE_SIZE_LABEL,
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
    const [fileInputKey, setFileInputKey] = useState(0);
    const form = useForm<PhotoUploadFormValues>({
        resolver: zodResolver(photoUploadSchema),
        defaultValues: defaultPhotoUploadFormValues
    });
    const fileField = form.register("file");
    const disabled = isSubmitting || form.formState.isSubmitting;
    const fileError = form.formState.errors.file?.message;
    const photoTypeError = form.formState.errors.photo_type?.message;
    const takenAtError = form.formState.errors.taken_at?.message;
    const captionError = form.formState.errors.caption?.message;
    const notesError = form.formState.errors.notes?.message;

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);
        form.reset(defaultPhotoUploadFormValues);
        setFileInputKey((current) => current + 1);
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enviar foto</CardTitle>
                <CardDescription>
                    Envie uma imagem JPG, PNG, WEBP ou GIF de até {PHOTO_MAX_FILE_SIZE_LABEL}.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div
                            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2"
                            role="alert"
                        >
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="photo-file">Arquivo *</Label>
                        <Input
                            key={fileInputKey}
                            id="photo-file"
                            type="file"
                            accept={PHOTO_ACCEPT_ATTRIBUTE}
                            disabled={disabled}
                            aria-invalid={Boolean(fileError)}
                            aria-describedby="photo-file-help"
                            name={fileField.name}
                            onBlur={fileField.onBlur}
                            onChange={(event) => {
                                void fileField.onChange(event);

                                if (event.currentTarget.files?.length) {
                                    form.clearErrors("file");
                                }
                            }}
                            ref={fileField.ref}
                        />
                        <p id="photo-file-help" className="text-xs text-muted-foreground">
                            Evite fotos pesadas ou sem relação com a planta.
                        </p>
                        <FormErrorMessage message={fileError} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="photo_type">Tipo</Label>
                        <Input
                            id="photo_type"
                            placeholder="routine"
                            autoComplete="off"
                            disabled={disabled}
                            aria-invalid={Boolean(photoTypeError)}
                            {...form.register("photo_type")}
                        />
                        <FormErrorMessage message={photoTypeError} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="taken_at">Tirada em</Label>
                        <Input
                            id="taken_at"
                            type="datetime-local"
                            disabled={disabled}
                            aria-invalid={Boolean(takenAtError)}
                            {...form.register("taken_at")}
                        />
                        <FormErrorMessage message={takenAtError} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="caption">Legenda</Label>
                        <Input
                            id="caption"
                            placeholder="Registro visual"
                            autoComplete="off"
                            disabled={disabled}
                            aria-invalid={Boolean(captionError)}
                            {...form.register("caption")}
                        />
                        <FormErrorMessage message={captionError} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="photo-notes">Notas</Label>
                        <textarea
                            id="photo-notes"
                            rows={4}
                            placeholder="Upload via web, folha nova, praga visível..."
                            disabled={disabled}
                            aria-invalid={Boolean(notesError)}
                            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("notes")}
                        />
                        <FormErrorMessage message={notesError} />
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

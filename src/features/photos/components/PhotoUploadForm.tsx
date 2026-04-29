import { zodResolver } from "@hookform/resolvers/zod";
import {
    CalendarDays,
    FileImage,
    ImagePlus,
    Loader2,
    MessageSquareText,
    Upload
} from "lucide-react";
import { useState, type ReactNode } from "react";
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
import { Label } from "@/shared/components/ui/label";

type PhotoUploadFormProps = {
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: PhotoUploadFormValues) => Promise<void> | void;
};

const labelClassName = "text-sm font-medium text-foreground";

const fieldControlClassName =
    "h-full min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70";

const fileInputClassName =
    "w-full cursor-pointer rounded-2xl border border-dashed border-input bg-background px-4 py-4 text-sm text-muted-foreground shadow-sm transition-colors file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70";

const textareaClassName =
    "min-h-32 w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-7 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70";

function FieldShell({ children }: { children: ReactNode }) {
    return (
        <div className="group relative flex h-11 w-full items-center rounded-2xl border border-input bg-background px-3 shadow-sm transition-colors hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
            {children}
        </div>
    );
}

function FieldIcon({ children }: { children: ReactNode }) {
    return (
        <div className="mr-3 flex h-full w-5 shrink-0 items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary">
            {children}
        </div>
    );
}

function SectionIcon({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-transparent text-primary">
            {children}
        </div>
    );
}

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
    const takenAtError = form.formState.errors.taken_at?.message;
    const captionError = form.formState.errors.caption?.message;
    const notesError = form.formState.errors.notes?.message;

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);
        form.reset(defaultPhotoUploadFormValues);
        setFileInputKey((current) => current + 1);
    });

    return (
        <Card className="overflow-visible border-border/70 bg-card shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                    <SectionIcon>
                        <ImagePlus className="h-5 w-5" />
                    </SectionIcon>

                    <div className="min-w-0">
                        <CardTitle className="text-lg">Enviar foto</CardTitle>
                        <CardDescription>
                            Adicione uma imagem da planta e registre a data do acompanhamento.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div
                            className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2"
                            role="alert"
                        >
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2 md:col-span-2">
                        <Label className={labelClassName} htmlFor="photo-file">
                            Arquivo *
                        </Label>

                        <input
                            key={fileInputKey}
                            id="photo-file"
                            type="file"
                            accept={PHOTO_ACCEPT_ATTRIBUTE}
                            disabled={disabled}
                            aria-invalid={Boolean(fileError)}
                            aria-describedby="photo-file-help"
                            className={fileInputClassName}
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
                            JPG, PNG, WEBP ou GIF de até {PHOTO_MAX_FILE_SIZE_LABEL}.
                        </p>

                        <FormErrorMessage message={fileError} />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="taken_at">
                            Data da foto
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <CalendarDays className="h-4 w-4" />
                            </FieldIcon>

                            <input
                                id="taken_at"
                                type="date"
                                disabled={disabled}
                                aria-invalid={Boolean(takenAtError)}
                                className={fieldControlClassName}
                                {...form.register("taken_at")}
                            />
                        </FieldShell>

                        <p className="text-xs text-muted-foreground">
                            Se não informar, será usada a data atual.
                        </p>

                        <FormErrorMessage message={takenAtError} />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="caption">
                            Legenda
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <FileImage className="h-4 w-4" />
                            </FieldIcon>

                            <input
                                id="caption"
                                type="text"
                                placeholder="Ex.: Folha nova"
                                autoComplete="off"
                                disabled={disabled}
                                aria-invalid={Boolean(captionError)}
                                className={fieldControlClassName}
                                {...form.register("caption")}
                            />
                        </FieldShell>

                        <FormErrorMessage message={captionError} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className={labelClassName} htmlFor="photo-notes">
                            Observações
                        </Label>

                        <div className="relative">
                            <MessageSquareText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                            <textarea
                                id="photo-notes"
                                rows={4}
                                placeholder="Folha nova, praga visível, recuperação, mudança de local..."
                                disabled={disabled}
                                aria-invalid={Boolean(notesError)}
                                className={`${textareaClassName} pl-11`}
                                {...form.register("notes")}
                            />
                        </div>

                        <FormErrorMessage message={notesError} />
                    </div>

                    <div className="md:col-span-2">
                        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm leading-6 text-muted-foreground">
                                Revise a foto, a data e as observações antes de enviar.
                            </p>

                            <Button
                                type="submit"
                                disabled={disabled}
                                className="h-11 w-full rounded-2xl px-6 text-sm font-semibold shadow-sm transition hover:shadow-md disabled:shadow-none sm:w-auto"
                            >
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
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

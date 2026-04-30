import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";

const TURNSTILE_SCRIPT_SRC =
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileTheme = "auto" | "light" | "dark";
type TurnstileSize = "normal" | "compact";
type CaptchaStatus = "loading" | "ready" | "verified" | "expired" | "error";

type TurnstileRenderOptions = {
    sitekey: string;
    action?: string;
    theme?: TurnstileTheme;
    size?: TurnstileSize;
    callback?: (token: string) => void;
    "expired-callback"?: () => void;
    "error-callback"?: () => void;
    "timeout-callback"?: () => void;
};

type TurnstileApi = {
    render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
    remove: (widgetId: string) => void;
    reset: (widgetId?: string) => void;
};

declare global {
    interface Window {
        turnstile?: TurnstileApi;
    }
}

type TurnstileWidgetProps = {
    readonly siteKey: string;
    readonly action: string;
    readonly resetSignal: number;
    readonly onVerify: (token: string) => void;
    readonly onExpire: () => void;
    readonly onError: () => void;
    readonly className?: string;
};

let turnstileScriptPromise: Promise<void> | null = null;

function cn(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
}

function loadTurnstileScript(): Promise<void> {
    if (window.turnstile) {
        return Promise.resolve();
    }

    if (turnstileScriptPromise) {
        return turnstileScriptPromise;
    }

    turnstileScriptPromise = new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector<HTMLScriptElement>(
            `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
        );

        const finishLoading = () => {
            if (window.turnstile) {
                resolve();
                return;
            }

            reject(new Error("Cloudflare Turnstile não foi carregado."));
        };

        if (existingScript) {
            existingScript.addEventListener("load", finishLoading, { once: true });
            existingScript.addEventListener(
                "error",
                () => reject(new Error("Falha ao carregar Cloudflare Turnstile.")),
                { once: true },
            );
            return;
        }

        const script = document.createElement("script");
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = finishLoading;
        script.onerror = () =>
            reject(new Error("Falha ao carregar Cloudflare Turnstile."));

        document.head.appendChild(script);
    });

    return turnstileScriptPromise;
}

function getStatusMessage(status: CaptchaStatus): string {
    if (status === "verified") {
        return "Verificação concluída. Você já pode continuar.";
    }

    if (status === "expired") {
        return "A verificação expirou. Confirme novamente para continuar.";
    }

    if (status === "error") {
        return "Não foi possível carregar a verificação. Tente novamente.";
    }

    if (status === "ready") {
        return "Confirme a verificação para proteger sua conta.";
    }

    return "Preparando a verificação de segurança...";
}

export function TurnstileWidget({
    siteKey,
    action,
    resetSignal,
    onVerify,
    onExpire,
    onError,
    className,
}: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);
    const callbacksRef = useRef({ onVerify, onExpire, onError });
    const [status, setStatus] = useState<CaptchaStatus>("loading");

    useEffect(() => {
        callbacksRef.current = { onVerify, onExpire, onError };
    }, [onVerify, onExpire, onError]);

    useEffect(() => {
        let isMounted = true;

        const removeWidget = () => {
            const widgetId = widgetIdRef.current;

            if (widgetId && window.turnstile) {
                window.turnstile.remove(widgetId);
            }

            widgetIdRef.current = null;
        };

        setStatus("loading");
        removeWidget();

        loadTurnstileScript()
            .then(() => {
                if (!isMounted || !containerRef.current || !window.turnstile) {
                    return;
                }

                setStatus("ready");

                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    action,
                    theme: "auto",
                    size: "normal",
                    callback: (token) => {
                        if (!isMounted) {
                            return;
                        }

                        setStatus("verified");
                        callbacksRef.current.onVerify(token);
                    },
                    "expired-callback": () => {
                        if (!isMounted) {
                            return;
                        }

                        setStatus("expired");
                        callbacksRef.current.onExpire();
                    },
                    "timeout-callback": () => {
                        if (!isMounted) {
                            return;
                        }

                        setStatus("expired");
                        callbacksRef.current.onExpire();
                    },
                    "error-callback": () => {
                        if (!isMounted) {
                            return;
                        }

                        setStatus("error");
                        callbacksRef.current.onError();
                    },
                });
            })
            .catch(() => {
                if (!isMounted) {
                    return;
                }

                setStatus("error");
                callbacksRef.current.onError();
            });

        return () => {
            isMounted = false;
            removeWidget();
        };
    }, [action, resetSignal, siteKey]);

    const isLoading = status === "loading";
    const isError = status === "error" || status === "expired";
    const isVerified = status === "verified";

    return (
        <section
            className={cn(
                "rounded-2xl border bg-muted/20 p-4 shadow-sm transition-colors",
                isVerified && "border-primary/25 bg-primary/5",
                isError && "border-destructive/25 bg-destructive/5",
                !isVerified && !isError && "border-border/70",
                className,
            )}
        >
            <div className="mb-3 flex items-start gap-3">
                <div
                    className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                        isVerified && "border-primary/20 text-primary",
                        isError && "border-destructive/20 text-destructive",
                        !isVerified && !isError && "border-border/70 text-muted-foreground",
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isError ? (
                        <AlertTriangle className="h-5 w-5" />
                    ) : (
                        <ShieldCheck className="h-5 w-5" />
                    )}
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                        Verificação de segurança
                    </p>

                    <p
                        className={cn(
                            "mt-1 text-sm leading-5",
                            isError ? "text-destructive" : "text-muted-foreground",
                        )}
                    >
                        {getStatusMessage(status)}
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/60 bg-background/80 px-3 py-3">
                <div className="flex min-h-[72px] w-full items-center justify-center">
                    {isLoading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando proteção...
                        </div>
                    )}

                    <div
                        ref={containerRef}
                        className={cn(
                            "flex justify-center",
                            isLoading && "hidden",
                        )}
                    />
                </div>
            </div>
        </section>
    );
}
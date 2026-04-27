import { BookOpen, Droplets, Leaf, Thermometer, Wind } from "lucide-react";

import type { SpeciesProfile } from "@/features/species/types/speciesTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/shared/components/ui/card";

type SpeciesDetailPanelProps = {
  species?: SpeciesProfile;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
};

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1
});

function finiteNumberOrNull(value?: number | null): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

function valueOrFallback(value?: string | number | null): string {
  if (value === null || value === undefined) {
    return "Não informado";
  }

  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized || "Não informado";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? formatNumber(value) : "Não informado";
  }

  return "Não informado";
}

function rangeValue(
  min?: number | null,
  max?: number | null,
  suffix = ""
): string {
  const normalizedMin = finiteNumberOrNull(min);
  const normalizedMax = finiteNumberOrNull(max);

  if (normalizedMin === null && normalizedMax === null) {
    return "Não informado";
  }

  if (normalizedMin !== null && normalizedMax !== null) {
    return `${formatNumber(normalizedMin)} a ${formatNumber(normalizedMax)}${suffix}`;
  }

  if (normalizedMin !== null) {
    return `mín. ${formatNumber(normalizedMin)}${suffix}`;
  }

  return `máx. ${formatNumber(normalizedMax as number)}${suffix}`;
}

function wateringFrequency(value?: number | null): string {
  const days = finiteNumberOrNull(value);

  if (days === null || days <= 0) {
    return "Não informado";
  }

  return days === 1 ? "Diária" : `A cada ${formatNumber(days)} dia(s)`;
}

export function SpeciesDetailPanel({
  species,
  isLoading = false,
  errorMessage,
  onRetry
}: SpeciesDetailPanelProps) {
  if (isLoading) {
    return (
      <LoadingState
        title="Carregando espécie"
        description="Buscando detalhes da espécie selecionada."
      />
    );
  }

  if (errorMessage) {
    return (
      <ErrorState
        title="Não foi possível carregar a espécie"
        description={errorMessage}
        actionLabel={onRetry ? "Tentar novamente" : undefined}
        onAction={onRetry}
      />
    );
  }

  if (!species) {
    return (
      <EmptyState
        icon={<Leaf className="h-6 w-6" />}
        title="Selecione uma espécie"
        description="Clique em uma espécie da lista para visualizar os detalhes aqui."
      />
    );
  }

  const metrics = [
    {
      label: "Frequência de rega",
      value: wateringFrequency(species.watering_frequency_days),
      icon: Droplets
    },
    {
      label: "Temperatura ideal",
      value: rangeValue(species.ideal_temp_min, species.ideal_temp_max, "°C"),
      icon: Thermometer
    },
    {
      label: "Umidade ideal",
      value: rangeValue(
        species.ideal_humidity_min,
        species.ideal_humidity_max,
        "%"
      ),
      icon: Wind
    },
    {
      label: "Preferência de luz",
      value: valueOrFallback(species.light_preference),
      icon: Leaf
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>

          <StatusBadge tone={species.is_active ? "success" : "neutral"}>
            {species.is_active ? "Ativa" : "Inativa"}
          </StatusBadge>
        </div>

        <CardTitle>{species.common_name}</CardTitle>
        <CardDescription className="italic">
          {valueOrFallback(species.scientific_name)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="rounded-2xl border bg-background p-4"
              >
                <Icon className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-xs font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-1 text-sm font-semibold">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border bg-background p-4">
            <p className="text-sm font-medium">Substrato</p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
              {valueOrFallback(species.substrate_notes)}
            </p>
          </div>

          <div className="rounded-2xl border bg-background p-4">
            <p className="text-sm font-medium">Notas gerais</p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
              {valueOrFallback(species.general_notes)}
            </p>
          </div>

          <div className="rounded-2xl border bg-background p-4">
            <p className="text-sm font-medium">Sintomas comuns</p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
              {valueOrFallback(species.common_symptoms)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

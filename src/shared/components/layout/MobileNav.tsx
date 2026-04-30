import { NavLink } from "react-router-dom";

import {
    adminNavItems,
    appInfoNavItems,
    mainNavItems,
    type AppNavItem
} from "@/shared/constants/navigation";
import { cn } from "@/shared/utils/cn";

type MobileNavProps = {
    canSeeAdmin: boolean;
};

type MobileNavLinkProps = {
    item: AppNavItem;
};

function normalizeText(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function shouldHideNavItem(item: AppNavItem): boolean {
    const label = normalizeText(item.label);
    const path = item.path.trim().toLowerCase();

    return (
        label.includes("especie") ||
        label.includes("configuracao") ||
        label.includes("configuracoes") ||
        path.includes("species") ||
        path.includes("especies") ||
        path.includes("settings") ||
        path.includes("configuracoes") ||
        path.includes("config")
    );
}

function getVisibleNavItems(items: readonly AppNavItem[]): readonly AppNavItem[] {
    return items.filter((item) => !shouldHideNavItem(item));
}

function MobileNavLink({ item }: MobileNavLinkProps) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
                cn(
                    "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl border px-3 py-2 text-sm font-medium shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                        ? "border-primary/20 bg-primary text-primary-foreground"
                        : "border-border/70 bg-card text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                )
            }
        >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
        </NavLink>
    );
}

export function MobileNav({ canSeeAdmin }: MobileNavProps) {
    const visibleMainNavItems = getVisibleNavItems(mainNavItems);
    const visibleInfoNavItems = getVisibleNavItems(appInfoNavItems);
    const visibleAdminNavItems = getVisibleNavItems(adminNavItems);

    const items: readonly AppNavItem[] = canSeeAdmin
        ? [...visibleMainNavItems, ...visibleInfoNavItems, ...visibleAdminNavItems]
        : [...visibleMainNavItems, ...visibleInfoNavItems];

    return (
        <nav
            aria-label="Navegação principal"
            className="sticky top-16 z-10 flex gap-2 overflow-x-auto border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur lg:hidden"
        >
            {items.map((item) => (
                <MobileNavLink key={item.path} item={item} />
            ))}
        </nav>
    );
}

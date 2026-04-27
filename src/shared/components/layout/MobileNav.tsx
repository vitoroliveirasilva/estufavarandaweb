import { NavLink } from "react-router-dom";

import {
    adminNavItems,
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

function MobileNavLink({ item }: MobileNavLinkProps) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
                cn(
                    "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                )
            }
        >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
        </NavLink>
    );
}

export function MobileNav({ canSeeAdmin }: MobileNavProps) {
    const items: readonly AppNavItem[] = canSeeAdmin
        ? [...mainNavItems, ...adminNavItems]
        : mainNavItems;

    return (
        <nav
            aria-label="Navegação principal"
            className="sticky top-16 z-10 flex gap-2 overflow-x-auto border-b bg-background/90 px-4 py-2 backdrop-blur lg:hidden"
        >
            {items.map((item) => (
                <MobileNavLink key={item.path} item={item} />
            ))}
        </nav>
    );
}

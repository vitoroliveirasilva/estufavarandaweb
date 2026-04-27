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

function MobileNavLink({ item }: { item: AppNavItem }) {
    return (
        <NavLink
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
                cn(
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition",
                    isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                )
            }
        >
            {item.label}
        </NavLink>
    );
}

export function MobileNav({ canSeeAdmin }: MobileNavProps) {
    const items = canSeeAdmin ? [...mainNavItems, ...adminNavItems] : mainNavItems;

    return (
        <nav className="sticky top-16 z-10 flex gap-2 overflow-x-auto border-b bg-background/90 px-4 py-2 backdrop-blur lg:hidden">
            {items.map((item) => (
                <MobileNavLink key={item.path} item={item} />
            ))}
        </nav>
    );
}
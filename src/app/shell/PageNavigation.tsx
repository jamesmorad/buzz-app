import type { RegisteredPage } from "../../features/pages/service";
import type { NavigationOpenOptions } from "../../features/navigation/controller";
import {
  ContributionBoundary,
  contributionKey,
} from "../../features/conversation/ContributionBoundary";
import { NavigationItem } from "../../shared/design-system/ui/NavigationItem";
import { Tabs } from "../../shared/design-system/ui/Tabs";
import { PageIcon } from "./PageIcon";
import { Avatar } from "../../shared/design-system/ui/Avatar";
import { BestieUnreadBadge, usePagePresentation } from "./BestieNavigation";

export function PageNavigation({
  pages,
  selected,
  onSelect,
  placement = "sidebar",
  orientation = "horizontal",
}: {
  pages: readonly RegisteredPage[];
  selected: string;
  onSelect(key: string, options?: Pick<NavigationOpenOptions, "focus">): void;
  placement?: "sidebar" | "topbar";
  orientation?: "horizontal" | "vertical";
}) {
  const presentation = usePagePresentation();
  if (placement === "topbar") {
    return (
      <Tabs
        label="Topbar pages"
        variant="dock"
        orientation={orientation}
        value={pages.some((page) => page.key === selected) ? selected : null}
        onValueChange={(key) => onSelect(key, { focus: "preserve" })}
        items={pages.map((page) => {
          const Badge = page.badge;
          const { icon, image, avatar, label } = presentation(page);
          return {
            value: page.key,
            label,
            icon: avatar ? (
              <Avatar
                src={avatar.src}
                alt=""
                fallback={label}
                shape={avatar.shape}
                size="small"
              />
            ) : (
              <PageIcon icon={icon} image={image} size={20} strokeWidth={2.5} />
            ),
            panelId: `shell-page-${page.key}`,
            trailing: (
              <>
                {Badge && (
                  <ContributionBoundary
                    key={contributionKey(page)}
                    fallback={null}
                  >
                    <Badge />
                  </ContributionBoundary>
                )}
                <BestieUnreadBadge pageKey={page.key} />
              </>
            ),
          };
        })}
      />
    );
  }
  return pages.map((page) => {
    const { label, icon, image, avatar } = presentation(page);
    const Badge = page.badge;
    const badge = Badge && (
      <ContributionBoundary key={contributionKey(page)} fallback={null}>
        <Badge />
      </ContributionBoundary>
    );
    const select = () => {
      onSelect(page.key);
      document.getElementById("main-content")?.focus({ preventScroll: true });
    };
    const pageIcon = avatar ? (
      <Avatar
        key={page.key}
        src={avatar.src}
        alt=""
        fallback={label}
        shape={avatar.shape}
        size="compact"
      />
    ) : (
      <PageIcon
        key={page.key}
        icon={icon}
        image={image}
        size={16}
        strokeWidth={2.5}
      />
    );
    return (
      <NavigationItem
        key={page.key}
        onClick={select}
        selected={selected === page.key}
        label={label}
        title={label}
        variant="row"
        trailing={badge}
        icon={<span className="shell-page-icon">{pageIcon}</span>}
      />
    );
  });
}

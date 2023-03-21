import { SidebarItemsType } from '@/types/sidebar';

import SidebarNavList from './SidebarNavList';
import SidebarNavListItem from './SidebarNavListItem';

interface ReduceChildRoutesProps {
  depth: number;
  page: SidebarItemsType;
  items: JSX.Element[];
  currentRoute: string;
}

const reduceChildRoutes = (props: ReduceChildRoutesProps) => {
  const { items, page, depth, currentRoute } = props;

  if (page.children) {
    items.push(
      <SidebarNavListItem
        depth={depth}
        icon={page.icon}
        key={page.title}
        badge={page.badge}
        open={true}
        title={page.title}
        href={page.href}
        disabled={!!page.disabled}
      >
        <SidebarNavList depth={depth + 1} pages={page.children} />
      </SidebarNavListItem>
    );
  } else {
    items.push(
      <SidebarNavListItem
        depth={depth}
        href={page.href}
        icon={page.icon}
        key={page.title}
        badge={page.badge}
        title={page.title}
        disabled={!!page.disabled}
      />
    );
  }

  return items;
};

export default reduceChildRoutes;

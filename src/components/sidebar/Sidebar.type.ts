export type SidebarItemsType = {
  href?: string;
  title: string;
  description?: string;
  icon: React.FC<any>;
  children?: SidebarItemsType[];
  badge?: string;
  disabled?: boolean;
};

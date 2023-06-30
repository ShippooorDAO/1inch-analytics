import styled from '@emotion/styled';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Chip,
  Collapse,
  ListItemButton,
  ListItemProps,
  ListItemText,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { lighten, rgba } from 'polished';
import React from 'react';

interface ItemProps {
  activeclassname?: string;
  onClick?: () => void;
  to?: string;
  component?: typeof Link;
  depth: number;
}

const Item = styled(ListItemButton)<ItemProps>`
  width: 100%;
  border-radius: 10px;
  padding: 12px;
  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }
  &:hover {
    background-color: ${(props) =>
      lighten(0.08, props.theme.palette.background.default)};
    color: ${(props) => props.theme.sidebar.color};
  }
  &.${(props) => props.activeclassname} {
    background-color: ${(props) =>
      lighten(0.25, props.theme.palette.background.default)};
    background: rgba(255, 255, 255, 0.08);
    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

interface TitleInterface {
  depth: number;
}

const Title = styled(ListItemText)<TitleInterface>`
  margin: 0;
  span {
    color: ${(props) =>
      rgba(
        props.theme.sidebar.color,
        props.depth && props.depth > 0 ? 0.7 : 1
      )};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    padding: 0 ${(props) => props.theme.spacing(4)};
  }
`;

const Badge = styled(Chip)`
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 26px;
  top: 12px;
  background: ${(props) => props.theme.sidebar.badge.background};
  z-index: 1;
  span.MuiChip-label,
  span.MuiChip-label:hover {
    font-size: 11px;
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)};
    padding-right: ${(props) => props.theme.spacing(2)};
  }
`;

const ExpandLessIcon = styled(ExpandLess)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const ExpandMoreIcon = styled(ExpandMore)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

interface SidebarNavListItemProps extends ListItemProps {
  className?: string;
  depth: number;
  href?: string;
  icon: React.FC<any>;
  badge?: string;
  open?: boolean;
  title: string;
  disabled?: boolean;
}

const SidebarNavListItem = (props: SidebarNavListItemProps) => {
  const {
    title,
    href,
    depth = 0,
    children,
    icon: Icon,
    badge,
    open: openProp = true,
    disabled,
  } = props;

  const { pathname } = useRouter();

  const [open, setOpen] = React.useState(openProp);

  const handleToggle = () => {
    setOpen((state) => !state);
  };

  if (href && children) {
    return (
      <React.Fragment>
        <Link href={href} passHref>
          <Item
            depth={depth}
            className={pathname === href ? 'active' : ''}
            activeclassname="active"
            disabled={disabled}
          >
            {Icon && <Icon />}
            <Title depth={depth}>
              <Typography variant="body2">{title}</Typography>
            </Title>
          </Item>
        </Link>
        {children}
      </React.Fragment>
    );
  }

  if (children) {
    return (
      <React.Fragment>
        <Item depth={depth} onClick={handleToggle} disabled={disabled}>
          {Icon && <Icon />}
          <Title depth={depth}>
            <Typography variant="body2">{title}</Typography>
          </Title>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Item>
        <Collapse in={open}>{children}</Collapse>
      </React.Fragment>
    );
  }

  return (
    <Link href={href ?? ''} passHref>
      <Item
        depth={depth}
        className={pathname === href ? 'active' : ''}
        activeclassname="active"
        disabled={disabled}
      >
        {Icon && <Icon />}
        <Title depth={depth}>
          <Typography variant="body2">{title}</Typography>
          {badge && <Badge label={badge} />}
        </Title>
      </Item>
    </Link>
  );
};

export default SidebarNavListItem;

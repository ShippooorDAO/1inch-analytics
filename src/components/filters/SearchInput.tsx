import styled from '@emotion/styled';
import { InputBase, InputBaseProps } from '@mui/material';
import { darken } from 'polished';
import { Search as SearchIcon } from 'react-feather';

const Search = styled.div`
  border-radius: 10px;
  background-color: ${(props) => props.theme.header.background};
  display: block;
  position: relative;
  width: 100%;
  &:hover {
    background-color: ${(props) => darken(0.05, props.theme.header.background)};
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;
  font-size: ${(props) => props.theme.typography.h6.fontSize};
  > input {
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-right: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(12)};
  }
`;

export function SearchInput({ ...props }: InputBaseProps) {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Input {...props} />
    </Search>
  );
}

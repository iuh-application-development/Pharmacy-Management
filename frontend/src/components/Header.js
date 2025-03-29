import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const NavBar = styled.nav`
  background-color: ${theme.colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  color: ${theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.secondary};
  }
`;

const LoginButton = styled(Link)`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

const Header = () => {
  return (
    <NavBar>
      <NavContainer>
        <Logo to="/">PharmaCore</Logo>
        <LoginButton to="/login">Đăng nhập</LoginButton>
      </NavContainer>
    </NavBar>
  );
};

export default Header;

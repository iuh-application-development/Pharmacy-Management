import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const BannerContainer = styled.div`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 4rem 1rem;
  text-align: center;
`;

const BannerTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const BannerSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const BannerButton = styled(Link)`
  background-color: ${theme.colors.white};
  color: ${theme.colors.primary};
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.lightGray};
    transform: translateY(-2px);
  }
`;

const Banner = () => {
  return (
    <BannerContainer>
      <BannerTitle>Giải pháp quản lý dược phẩm thông minh</BannerTitle>
      <BannerSubtitle>Tối ưu hóa việc quản lý thuốc, đơn hàng và nhân sự.</BannerSubtitle>
      <BannerButton to="/about">Tìm hiểu thêm</BannerButton>
    </BannerContainer>
  );
};

export default Banner;

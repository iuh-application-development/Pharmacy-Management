import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 4rem 0 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  margin-bottom: 2rem;
`;

const FooterTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FooterLink = styled(Link)`
  color: ${theme.colors.white};
  text-decoration: none;
  display: block;
  margin-bottom: 0.8rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const FooterText = styled.p`
  opacity: 0.8;
  line-height: 1.6;
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.8;
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Về chúng tôi</FooterTitle>
          <FooterText>
            PharmaCore cung cấp giải pháp quản lý hiệu quả cho các nhà thuốc và 
            chuỗi dược phẩm, giúp tối ưu hóa quy trình kinh doanh.
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Liên kết</FooterTitle>
          <FooterLink to="/about">Giới thiệu</FooterLink>
          <FooterLink to="/features">Tính năng</FooterLink>
          <FooterLink to="/pricing">Bảng giá</FooterLink>
          <FooterLink to="/contact">Liên hệ</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Hỗ trợ</FooterTitle>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/support">Trung tâm hỗ trợ</FooterLink>
          <FooterLink to="/documentation">Tài liệu hướng dẫn</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Liên hệ</FooterTitle>
          <FooterText>
            Email: support@pharmacore.com<br />
            Điện thoại: (84) 123-456-789<br />
            Địa chỉ: 123 Đường ABC, Quận XYZ<br />
            TP. Hồ Chí Minh, Việt Nam
          </FooterText>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} PharmaCore. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;

import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { BiCapsule, BiPackage, BiGroup } from 'react-icons/bi';

const FeaturesSection = styled.div`
  background-color: ${theme.colors.white};
  padding: 5rem 1rem;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const FeatureCard = styled.div`
  background-color: ${theme.colors.white};
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid ${theme.colors.lightGray};

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    border-color: ${theme.colors.primary};
  }
`;

const IconWrapper = styled.div`
  color: ${theme.colors.primary};
  font-size: 3rem;
  margin-bottom: 1.5rem;
  
  svg {
    transition: transform 0.3s ease;
  }

  ${FeatureCard}:hover & svg {
    transform: scale(1.1);
  }
`;

const FeatureTitle = styled.h3`
  color: ${theme.colors.darkGray};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: ${theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 700;
`;

const Features = () => {
  return (
    <FeaturesSection>
      <FeaturesContainer>
        <SectionTitle>Tính năng nổi bật</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <IconWrapper>
              <BiCapsule />
            </IconWrapper>
            <FeatureTitle>Quản lý Thuốc</FeatureTitle>
            <FeatureDescription>
              Theo dõi hàng tồn kho & đơn thuốc một cách chuyên nghiệp. 
              Tự động cập nhật và cảnh báo hết hàng.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <IconWrapper>
              <BiPackage />
            </IconWrapper>
            <FeatureTitle>Quản lý Đơn hàng</FeatureTitle>
            <FeatureDescription>
              Xử lý đơn hàng nhanh chóng & chính xác. 
              Tích hợp hệ thống thanh toán đa dạng.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <IconWrapper>
              <BiGroup />
            </IconWrapper>
            <FeatureTitle>Quản lý Nhân viên</FeatureTitle>
            <FeatureDescription>
              Phân quyền & kiểm soát tài khoản dễ dàng.
              Theo dõi hiệu suất làm việc.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesContainer>
    </FeaturesSection>
  );
};

export default Features;

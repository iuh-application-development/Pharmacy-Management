import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BannerContainer = styled.div`
  position: relative;
  background: linear-gradient(135deg, #059669, #34d399); /* Màu nền gradient */
  color: #ffffff;
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Căn đều nội dung và hình ảnh */
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column; /* Xếp dọc trên màn hình nhỏ */
    text-align: center;
    gap: 1.5rem;
  }
`;

const BannerContent = styled.div`
  flex: 1;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    max-width: 100%;
    align-items: center;
  }
`;

const BannerImage = styled.img`
  flex: 1;
  max-width: 45%;
  height: auto;
  border-radius: 12px; /* Bo góc mềm mại */

  @media (max-width: 768px) {
    max-width: 80%;
  }
`;

const BannerTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`;

const BannerSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const BannerButton = styled(motion.a)`
  display: inline-block;
  background: #fbbf24;
  color: #059669;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Banner = () => {
  return (
    <BannerContainer>
      <BannerContent>
        <BannerTitle
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Smart Pharmaceutical Management Solution
        </BannerTitle>
        <BannerSubtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Optimize the management of medicines, orders, and personnel.
        </BannerSubtitle>
        <BannerButton
          href="/login"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          Learn More
        </BannerButton>
      </BannerContent>
      <BannerImage src="/images/medicine2-Photoroom.png" alt="Pharmacy Illustration" />
    </BannerContainer>
  );
};

export default Banner;
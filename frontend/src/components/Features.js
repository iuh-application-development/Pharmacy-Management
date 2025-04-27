import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BiCapsule, BiPackage, BiGroup } from 'react-icons/bi';

const FeaturesContainer = styled.div`
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f9fafb, #ffffff); /* Gradient nền */
  text-align: center;
`;

const FeaturesTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  align-items: center;
`;

const FeatureCard = styled(motion.div)`
  background: #ffffff; /* Màu nền trắng */
  border-radius: 16px; /* Bo góc mềm mại hơn */
  padding: 2rem;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Đổ bóng mạnh hơn */
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-10px); /* Hiệu ứng nổi nhẹ */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Đổ bóng mạnh hơn khi hover */
    background-color: #f0fdf4; /* Màu nền xanh nhạt khi hover */
  }
`;

const IconWrapper = styled.div`
  font-size: 4rem; /* Tăng kích thước icon */
  color: #059669;
  margin-bottom: 1rem;
  transition: color 0.3s ease;

  ${FeatureCard}:hover & {
    color: #34d399; /* Thay đổi màu icon khi hover */
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem; /* Tăng kích thước tiêu đề */
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #0f172a;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
`;

const Features = () => {
  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Hiệu ứng xuất hiện lần lượt
      },
    },
  };

  return (
    <FeaturesContainer>
      <FeaturesTitle>Key Benefits</FeaturesTitle>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <FeaturesGrid>
          {[
            {
              icon: <BiCapsule />,
              title: 'Medicine Management',
              description: 'Track inventory and prescriptions professionally.',
            },
            {
              icon: <BiPackage />,
              title: 'Order Management',
              description: 'Process orders quickly and accurately.',
            },
            {
              icon: <BiGroup />,
              title: 'Employee Management',
              description: 'Easily assign roles and control accounts.',
            },
          ].map((feature, index) => (
            <FeatureCard
              key={index}
              variants={featureVariants}
              whileHover={{ scale: 1.05 }} // Slight zoom effect on hover
            >
              <IconWrapper>{feature.icon}</IconWrapper>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </motion.div>
    </FeaturesContainer>
  );
};

export default Features;
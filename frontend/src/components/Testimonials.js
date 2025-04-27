import React from 'react';
import styled from 'styled-components';

const TestimonialsSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center; /* Căn giữa nội dung và hình ảnh */
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #059669, #34d399); /* Màu nền gradient xanh */
  color: #ffffff; /* Màu chữ trắng */
  gap: 3rem; /* Khoảng cách giữa nội dung và hình ảnh */

  @media (max-width: 768px) {
    flex-direction: column; /* Xếp dọc trên màn hình nhỏ */
    text-align: center;
    gap: 1rem; /* Thêm khoảng cách giữa các phần tử trên màn hình nhỏ */
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  max-width: 35%; /* Tăng kích thước hình ảnh */
  display: flex;
  justify-content: center; /* Căn giữa hình ảnh */
  margin-left: 3rem;
  img {
    width: 100%; /* Đảm bảo hình ảnh không vượt quá kích thước container */
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    max-width: 80%; /* Giảm kích thước hình ảnh trên màn hình nhỏ */
    margin-left: 0; /* Loại bỏ dịch chuyển trên màn hình nhỏ */

  }
`;

const ContentContainer = styled.div`
  flex: 1;
  text-align: center; /* Căn giữa nội dung */
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Divider = styled.div`
  width: 50px;
  height: 4px;
  background-color: #ffffff; /* Màu trắng cho divider */
  margin: 1rem auto; /* Căn giữa divider */
`;

const Quote = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 500px; /* Giới hạn chiều rộng để cắt nội dung */
  margin: 0 auto; /* Căn giữa đoạn văn bản */
`;

const Author = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const Testimonials = () => {
  return (
    <TestimonialsSection>
      <ImageContainer>
        <img src="/images/customer-Photoroom.png" alt="Client Testimonial" />
      </ImageContainer>
      <ContentContainer>
        <Title>What Our Clients Say</Title>
        <Divider />
        <Quote>
          "The pharmacists are all really nice and knowledgeable! They really go the extra mile to make sure every patient gets the highest quality of care."
        </Quote>
        <Author>- Josh Kirven</Author>
      </ContentContainer>
    </TestimonialsSection>
  );
};

export default Testimonials;
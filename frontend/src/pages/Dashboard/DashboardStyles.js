import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  margin-left: 250px; /* Đẩy nội dung sang phải bằng chiều rộng của Sidebar */
  padding: 2rem;
  background-color: #f9f9f9; /* Màu nền cho nội dung */
  min-height: 100vh; /* Đảm bảo nội dung chiếm toàn bộ chiều cao màn hình */
  overflow-x: auto; /* Thêm cuộn ngang nếu cần */
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const StatCard = styled.div`
  background-color: #0f172a;
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const StatTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

export const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
`;
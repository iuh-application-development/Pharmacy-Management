import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background-color: #f9f9f9;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const StatCard = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

export const TableHeader = styled.th`
  background-color: #0f172a;
  color: #fff;
  padding: 0.5rem;
  text-align: left;
`;

export const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 0.5rem;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between; /* Đẩy các phần tử sang hai bên */
  align-items: center;
  margin-bottom: 1rem;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0f172a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1e293b;
  }
`;
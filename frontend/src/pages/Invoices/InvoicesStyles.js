import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  margin-left: 250px; /* Đẩy nội dung sang phải bằng chiều rộng của Sidebar */
  padding: 1rem;
  gap: 1rem; /* Khoảng cách giữa các phần */
`;

export const LeftSection = styled.div`
  flex: 2; /* Tăng tỷ lệ chiều rộng của phần trái */
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const RightSection = styled.div`
  flex: 1; /* Giảm tỷ lệ chiều rộng của phần phải */
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const MedicineDetails = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;

  h2 {
    text-align: center;
    margin-bottom: 1rem;
    color: #0f172a;
  }

  img {
    display: block;
    border-radius: 8px;
    border: 1px solid #ddd;
  }

  p {
    margin: 0.5rem 0;
    font-size: 1rem;
    color: #333;
  }

  strong {
    color: #0f172a;
  }
`;

export const MedicineList = styled.div`
  margin-top: 1rem;
`;

export const Cart = styled.div`
  margin-bottom: 1rem;
`;

export const InvoiceInfo = styled.div`
  margin-top: 1rem;
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

export const Button = styled.button`
  background-color: #0f172a;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #334155;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
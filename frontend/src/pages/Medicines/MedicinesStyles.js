import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 1rem;
  margin-left: 250px; /* Khoảng trống bằng độ rộng của sidebar */
  padding: 1rem;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Button = styled.button`
  background-color: #0f172a;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 0.5rem;

  &:hover {
    background-color: #334155;
  }
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

export const catalogMap = {
  ZXC311QWE: 'Hệ tim mạch & tạo máu',
  ZXC321QWE: 'Hệ tiêu hóa & gan mật',
  ZAQ321QWE: 'Thuốc giảm đau',
};

export const originMap = {
  XCVSDF123: 'Việt Nam',
  XCVSDF122: 'Mỹ',
  XCVSDF125: 'Pháp',
  XCVSDF124: 'Nhật Bản',
};

export const unitMap = {
  CVBDF123T: 'Viên',
  CV123GERT: 'Chai',
  CVB123ERT: 'Hộp',
  CVB141ERT: 'Gói',
  CV1223ERT: 'Vỉ',
};

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
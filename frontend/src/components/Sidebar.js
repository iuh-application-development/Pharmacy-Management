import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate} from 'react-router-dom';
import { BiHome, BiFile, BiUser, BiPackage, BiLock, BiLogOut } from 'react-icons/bi';
import axios from 'axios';

const SidebarContainer = styled.div`
  position: fixed; /* Sidebar cố định */
  top: 0;
  left: 0;
  height: 100vh; /* Chiều cao toàn màn hình */
  width: 250px; /* Độ rộng sidebar */
  background-color: #1e293b;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  z-index: 1000; /* Đảm bảo sidebar nằm trên các nội dung khác */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: bold;
`;

const Role = styled.span`
  font-size: 0.9rem;
  color: #10b981;
`;

const Menu = styled.div`
  flex: 1;
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;

  &.active {
    background-color:rgb(25, 231, 121);
  }

  &:hover {
    background-color: #334155;
  }

  svg {
    margin-right: 1rem;
  }
`;

const LogoutButton = styled.div`
  margin-top: auto;
  padding: 0.8rem 1rem;
  background-color: #ef4444;
  color: #fff;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #dc2626;
  }
`;

const Sidebar = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleLogout = async () => {
    try {
      // Gửi yêu cầu logout đến backend (nếu cần)
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/auth/logout/', {}, {
        headers: { Authorization: `Token ${token}` },
      });

      // Xóa token khỏi localStorage
      localStorage.removeItem('token');

      // Chuyển hướng đến trang Login
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Dù có lỗi, vẫn chuyển hướng đến trang Login
      navigate('/login');
    }
  };
  return (
    <SidebarContainer>
      <ProfileSection>
        <Avatar src="https://png.pngtree.com/png-clipart/20200721/original/pngtree-customer-service-free-avatar-user-icon-business-user-icon-users-group-png-image_4823037.jpg" alt="Admin Avatar" />
        <ProfileInfo>
          <Name>Admin</Name>
          <Role>Admin</Role>
        </ProfileInfo>
      </ProfileSection>

      <Menu>
        <MenuItem to="/dashboard" activeClassName="active">
          <BiHome /> Trang Chủ
        </MenuItem>
        <MenuItem to="/reports" activeClassName="active">
          <BiFile /> Báo Cáo
        </MenuItem>
        <MenuItem to="/invoices" activeClassName="active">
          <BiFile /> Hóa Đơn
        </MenuItem>
        <MenuItem to="/orders" activeClassName="active">
          <BiFile /> Đơn Đặt Hàng
        </MenuItem>
        <MenuItem to="/medicines" activeClassName="active">
          <BiPackage /> Thuốc
        </MenuItem>
        <MenuItem to="/suppliers" activeClassName="active">
          <BiPackage /> Nhà Cung Cấp
        </MenuItem>
        <MenuItem to="/employees" activeClassName="active">
          <BiUser /> Nhân Viên
        </MenuItem>
        <MenuItem to="/accounts" activeClassName="active">
          <BiLock /> Tài Khoản
        </MenuItem>
        
      </Menu>

      <LogoutButton onClick={handleLogout}>
        <BiLogOut /> Đăng Xuất
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
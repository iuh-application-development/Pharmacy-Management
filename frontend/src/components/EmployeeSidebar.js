import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiHome, BiFile, BiPackage, BiLogOut } from 'react-icons/bi';
import axios from 'axios';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: #1e293b;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  z-index: 1000;
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
    background-color: rgb(25, 231, 121);
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

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const employeeName = localStorage.getItem('employeeName') || 'Nhân viên';
  const role = localStorage.getItem('role') || 'Nhân viên bán hàng';

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/auth/logout/', {}, {
        headers: { Authorization: `Token ${token}` },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('employeeName');
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/login');
    }
  };

  return (
    <SidebarContainer>
      <ProfileSection>
        <Avatar src="https://png.pngtree.com/png-clipart/20200721/original/pngtree-customer-service-free-avatar-user-icon-business-user-icon-users-group-png-image_4823037.jpg" alt="Employee Avatar" />
        <ProfileInfo>
          <Name>{employeeName}</Name>
          <Role>{role}</Role>
        </ProfileInfo>
      </ProfileSection>

      <Menu>
        <MenuItem to="/employee-dashboard" activeClassName="active">
          <BiHome /> Trang Chủ
        </MenuItem>
        <MenuItem to="/employee/orders" activeClassName="active">
          <BiFile /> Đơn Hàng
        </MenuItem>
        <MenuItem to="/employee/medicines" activeClassName="active">
          <BiPackage /> Thuốc
        </MenuItem>
      </Menu>

      <LogoutButton onClick={handleLogout}>
        <BiLogOut /> Đăng Xuất
      </LogoutButton>
    </SidebarContainer>
  );
};

export default EmployeeSidebar; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import {
  Container,
  Content,
  StatsGrid,
  StatCard,
  StatTitle,
  StatValue,
} from './DashboardStyles';

const Dashboard = () => {
    const [stats, setStats] = useState({
      totalRevenue: 0,
      totalMedicines: 0,
      totalOrders: 0,
      totalEmployees: 0,
    });
  
    const fetchStats = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Token ${token}` };
      
        try {
          const [orderDetailsRes, medicinesRes, ordersRes, employeesRes] = await Promise.all([
            axios.get('http://localhost:8000/api/sales/order-details/', { headers }),
            axios.get('http://localhost:8000/api/medicines/medicines/', { headers }),
            axios.get('http://localhost:8000/api/sales/orders/', { headers }),
            axios.get('http://localhost:8000/api/auth/employees/', { headers }),
          ]);
      
          // Tính tổng thu nhập từ orderDetailsRes
          const totalRevenue = orderDetailsRes.data.reduce((sum, item) => {
            return sum + item.quantity * parseFloat(item.unitPrice);
          }, 0);
      
          setStats({
            totalRevenue: totalRevenue || 0,
            totalMedicines: medicinesRes.data?.length || 0,
            totalOrders: ordersRes.data?.length || 0,
            totalEmployees: employeesRes.data?.length || 0,
          });
        } catch (error) {
          console.error('Error fetching stats:', error.response?.data || error.message);
        }
      };
  
    useEffect(() => {
      fetchStats();
    }, []);
  
    return (
      <Container>
        <Sidebar />
        <Content>
          <h1>Dashboard</h1>
          <StatsGrid>
            <StatCard>
              <StatTitle>Tổng thu nhập</StatTitle>
              <StatValue>{stats.totalRevenue?.toLocaleString()} VND</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Số lượng thuốc</StatTitle>
              <StatValue>{stats.totalMedicines}</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Số đơn đặt hàng</StatTitle>
              <StatValue>{stats.totalOrders}</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Số nhân viên</StatTitle>
              <StatValue>{stats.totalEmployees}</StatValue>
            </StatCard>
          </StatsGrid>
        </Content>
      </Container>
    );
  };
  
  export default Dashboard;
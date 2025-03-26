import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa; /* Background color similar to landing page */
`;

const LoginForm = styled.form`
  background-color: #ffffff; /* White background for the form */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LoginTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #343a40; /* Dark color for the title */
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormControl = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da; /* Light border color */
  border-radius: 5px;
  margin-bottom: 1rem;
  background-color: #e9ecef; /* Light background color for input fields */
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff; /* Primary blue color for the button */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
`;

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', { username, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      if (role === 'Admin') {
        navigate('/dashboard');
      } else if (role === 'Nhân viên bán hàng') {
        navigate('/sales-dashboard');
      } else if (role === 'Nhân viên quản lý sản phẩm') {
        navigate('/product-manager-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Tên tài khoản hoặc mật khẩu không đúng.');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Login Now</LoginTitle>
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        {error && <div className="alert alert-danger">{error}</div>}
        <LoginButton type="submit">LOGIN</LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
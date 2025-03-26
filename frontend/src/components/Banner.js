import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="jumbotron text-center bg-primary text-white">
      <h1 className="display-4 font-weight-bold banner-title">Giải pháp quản lý dược phẩm thông minh</h1>
      <p className="lead banner-subtitle">Tối ưu hóa việc quản lý thuốc, đơn hàng và nhân sự.</p>
      <Link className="btn btn-light btn-sm" to="/about" role="button">Tìm hiểu thêm</Link>
    </div>
  );
};

export default Banner;
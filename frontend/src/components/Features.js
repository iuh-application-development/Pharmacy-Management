import React from 'react';

const Features = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-4 text-center">
          <div className="card feature-card">
            <div className="card-body">
              <i className="bi bi-capsule-pill" style={{ fontSize: '2rem' }}></i>
              <h5 className="card-title mt-3">Quản lý Thuốc</h5>
              <p className="card-text">Theo dõi hàng tồn kho & đơn thuốc.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div className="card feature-card">
            <div className="card-body">
              <i className="bi bi-box-seam" style={{ fontSize: '2rem' }}></i>
              <h5 className="card-title mt-3">Quản lý Đơn hàng</h5>
              <p className="card-text">Xử lý đơn hàng nhanh chóng & chính xác.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div className="card feature-card">
            <div className="card-body">
              <i className="bi bi-people" style={{ fontSize: '2rem' }}></i>
              <h5 className="card-title mt-3">Quản lý Nhân viên</h5>
              <p className="card-text">Phân quyền & kiểm soát tài khoản dễ dàng.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
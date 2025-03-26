import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark-blue mb-0">
      <div className="container">
        <Link className="navbar-brand text-white font-weight-bold" to="/">PharmaCore</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="btn btn-light" to="/login">Đăng nhập</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
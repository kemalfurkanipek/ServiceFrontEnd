import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authenticated'); // Kullanıcıyı çıkış yap
    navigate('/login'); // Login sayfasına yönlendir
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger mt-3">
      Çıkış Yap
    </button>
  );
}

export default Logout;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'uguryilmaz' && password === 'eminltdşti') {
      localStorage.setItem('authenticated', 'true');
      navigate('/students');  // Giriş başarılıysa öğrenciler sayfasına yönlendir
    } else {
      alert('Yanlış kullanıcı adı veya şifre');
    }
  };

  return (
    <div className="login-form">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Giriş Yap</button>
      </form>
    </div>
  );
}

export default Login;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StudentList from './components/StudentList';
import SchoolList from './components/SchoolList';
import ServiceList from './components/ServiceList';
import AccountList from './components/AccountList';
import StudentForm from './components/StudentForm';
import './App.css';
import SchoolForm from './components/SchoolForm';
import ServiceForm from './components/ServiceForm';
import UpdateServiceForm from './components/UpdateServiceForm';
import UpdateSchoolForm from './components/UpdateSchoolForm';
import UpdateStudentForm from './components/UpdateStudentForm';
import AccountForm from './components/AccountForm';
import UpdateAccountForm from './components/UpdateAccountForm';
import Report from './components/Report';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logout'; // Yeni eklenen Logout bileşeni

function App() {
  return (
    <Router>
      <div className="d-flex">
        <div className="sidebar bg-black">
          <h2 className="text-white text-center py-4">Öğrenci Yönetimi</h2>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/students">Öğrenciler</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/schools">Okullar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/services">Servisler</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/accounts">Cari Hesaplar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/reports">Rapor</Link>
            </li>
            <li className="nav-item mt-3">
              <Logout />  {/* Çıkış butonunu burada ekliyoruz */}
            </li>
          </ul>
        </div>
        <div className="content p-4 w-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/students" element={<PrivateRoute><StudentList /></PrivateRoute>} />
            <Route path="/students/new" element={<PrivateRoute><StudentForm /></PrivateRoute>} />
            <Route path="/students/edit/:id" element={<PrivateRoute><UpdateStudentForm /></PrivateRoute>} />
            <Route path="/schools" element={<PrivateRoute><SchoolList /></PrivateRoute>} />
            <Route path="/schools/new" element={<PrivateRoute><SchoolForm /></PrivateRoute>} />
            <Route path="/schools/edit/:id" element={<PrivateRoute><UpdateSchoolForm /></PrivateRoute>} />
            <Route path="/services" element={<PrivateRoute><ServiceList /></PrivateRoute>} />
            <Route path="/services/new" element={<PrivateRoute><ServiceForm /></PrivateRoute>} />
            <Route path="/services/edit/:id" element={<PrivateRoute><UpdateServiceForm /></PrivateRoute>} />
            <Route path="/accounts" element={<PrivateRoute><AccountList /></PrivateRoute>} />
            <Route path="/accounts/new" element={<PrivateRoute><AccountForm /></PrivateRoute>} />
            <Route path="/accounts/edit/:id" element={<PrivateRoute><UpdateAccountForm /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Report /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

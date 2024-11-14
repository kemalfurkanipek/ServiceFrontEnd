import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt, FaPlusCircle, FaSearch } from 'react-icons/fa';
import moment from 'moment';
import { Snackbar, Alert } from '@mui/material';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Filtreleme için state'ler
  const [nameFilter, setNameFilter] = useState('');
  const [surnameFilter, setSurnameFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  // Tooltip kontrolü için state
  const [showNameTooltip, setShowNameTooltip] = useState(false);
  const [showSurnameTooltip, setShowSurnameTooltip] = useState(false);
  const [showSchoolTooltip, setShowSchoolTooltip] = useState(false);
  const [showServiceTooltip, setShowServiceTooltip] = useState(false);

  // Ref'ler
  const nameButtonRef = useRef(null);
  const surnameButtonRef = useRef(null);
  const schoolButtonRef = useRef(null);
  const serviceButtonRef = useRef(null);

  const nameTooltipRef = useRef(null);
  const surnameTooltipRef = useRef(null);
  const schoolTooltipRef = useRef(null);
  const serviceTooltipRef = useRef(null);

  useEffect(() => {
    axios.get('https://service-backend-fawn.vercel.app/?vercelToolbarCode=BVD4sv2FgiQr6dU/students')
      .then(response => {
        const studentData = response.data;
        setStudents(studentData);
      })
      .catch(error => console.error('Veri çekme hatası:', error));
  }, []);

  useEffect(() => {
    if (location.state?.success) {
      setMessage(location.state?.message);
      setOpen(true);
      navigate('/students', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id) => {
    setSelectedStudent(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`https://service-backend-fawn.vercel.app/?vercelToolbarCode=BVD4sv2FgiQr6dU/students/${selectedStudent}`)
      .then(response => {
        setStudents(students.filter(student => student._id !== selectedStudent));
        setShowModal(false);
      })
      .catch(error => console.error('Silme hatası:', error));
  };

  // Tooltip dışına tıklandığında kapatmak için
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nameTooltipRef.current && !nameTooltipRef.current.contains(event.target) && 
          nameButtonRef.current && !nameButtonRef.current.contains(event.target)) {
        setShowNameTooltip(false);
      }
      if (surnameTooltipRef.current && !surnameTooltipRef.current.contains(event.target) &&
          surnameButtonRef.current && !surnameButtonRef.current.contains(event.target)) {
        setShowSurnameTooltip(false);
      }
      if (schoolTooltipRef.current && !schoolTooltipRef.current.contains(event.target) &&
          schoolButtonRef.current && !schoolButtonRef.current.contains(event.target)) {
        setShowSchoolTooltip(false);
      }
      if (serviceTooltipRef.current && !serviceTooltipRef.current.contains(event.target) &&
          serviceButtonRef.current && !serviceButtonRef.current.contains(event.target)) {
        setShowServiceTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtreleme işlemi
  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      student.surname.toLowerCase().includes(surnameFilter.toLowerCase()) &&
      (student.schoolId ? student.schoolId.name.toLowerCase().includes(schoolFilter.toLowerCase()) : true) &&
      (student.serviceId ? student.serviceId.plate.toLowerCase().includes(serviceFilter.toLowerCase()) : true)
    );
  });

  return (
    <div className="container mt-5">
      <div className="sticky-top bg-transparent p-3" style={{ zIndex: 1020 }}>
        <h2 className="text-primary">Öğrenci Listesi</h2>
        <Link to="/students/new" className="btn btn-success btn-sm">
          <FaPlusCircle /> Yeni Öğrenci Ekle
        </Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="thead-dark">
            <tr>
              <th scope="col"></th>
              <th scope="col">
                Adı
                <button
                  ref={nameButtonRef}
                  className="search-button"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={() => setShowNameTooltip(!showNameTooltip)}
                >
                  <FaSearch />
                </button>
                {showNameTooltip && (
                  <div
                    ref={nameTooltipRef}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ced4da',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      marginTop: '10px',
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="İsim ile filtrele"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </div>
                )}
              </th>
              <th scope="col">
                Soyadı
                <button
                  ref={surnameButtonRef}
                  className="search-button"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={() => setShowSurnameTooltip(!showSurnameTooltip)}
                >
                  <FaSearch />
                </button>
                {showSurnameTooltip && (
                  <div
                    ref={surnameTooltipRef}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ced4da',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      marginTop: '10px',
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Soyad ile filtrele"
                      value={surnameFilter}
                      onChange={(e) => setSurnameFilter(e.target.value)}
                    />
                  </div>
                )}
              </th>
              <th scope='col'>Adres</th>
              <th scope='col'>Telefon</th>
              <th scope='col'>
                Okul
                <button
                  ref={schoolButtonRef}
                  className="search-button"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={() => setShowSchoolTooltip(!showSchoolTooltip)}
                >
                  <FaSearch />
                </button>
                {showSchoolTooltip && (
                  <div
                    ref={schoolTooltipRef}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ced4da',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      marginTop: '10px',
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Okul ile filtrele"
                      value={schoolFilter}
                      onChange={(e) => setSchoolFilter(e.target.value)}
                    />
                  </div>
                )}
              </th>
              <th scope='col'>
                Servis
                <button
                  ref={serviceButtonRef}
                  className="search-button"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={() => setShowServiceTooltip(!showServiceTooltip)}
                >
                  <FaSearch />
                </button>
                {showServiceTooltip && (
                  <div
                    ref={serviceTooltipRef}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ced4da',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      marginTop: '10px',
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Servis ile filtrele"
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                    />
                  </div>
                )}
              </th>
              <th scope='col'>Kayıt Tarihi</th>
              <th scope="col" className="text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student._id}>
                <th scope="row">{index + 1}</th>
                <td>{student.name}</td>
                <td>{student.surname}</td>
                <td>{student.address}</td>
                <td>{student.telephone}</td>
                <td>{student.schoolId ? student.schoolId.name : 'Okul silinmiş'}</td>
                <td>{student.serviceId ? student.serviceId.plate : 'Servis silinmiş'}</td>
                <td>{moment(student.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                <td className="text-center">
                  <Link to={`/students/edit/${student._id}`} className="btn btn-primary btn-sm mr-2">
                    <FaEdit /> Düzenle
                  </Link>
                  <button 
                    onClick={() => handleDelete(student._id)} 
                    className="btn btn-danger btn-sm"
                  >
                    <FaTrashAlt /> Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Öğrenciyi Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bu öğrenciyi silmek istediğinize emin misiniz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default StudentList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { Snackbar, Alert } from '@mui/material';
import moment from 'moment';

function SchoolList() {
  const [schools, setSchools] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://service-backend-fawn.vercel.app/?vercelToolbarCode=BVD4sv2FgiQr6dU/schools')
      .then(response => setSchools(response.data))
      .catch(error => console.error('Veri çekme hatası:', error));
  }, []);

  const handleDelete = (id) => {
    setSelectedSchool(id);
    setShowModal(true);
  };

  useEffect(() => {
    if (location.state?.success) {
      console.log('TESTTT', location.state);
      setMessage(location.state?.message);
      setOpen(true);
      navigate('/schools', { replace: true, state: {} }); // Snackbar'ı gösterdikten sonra state'i temizle
    }
  }, [location.state, navigate]);

  const handleClose = () => {
    setOpen(false);
  };

  const confirmDelete = () => {
    axios.delete(`https://service-backend-fawn.vercel.app/?vercelToolbarCode=BVD4sv2FgiQr6dU/schools/${selectedSchool}`)
      .then(response => {
        setSchools(schools.filter(school => school._id !== selectedSchool));
        setShowModal(false);
      })
      .catch(error => console.error('Silme hatası:', error));
  };

  return (
    <div className="container mt-5">
      {/* Butonun Sabit Pozisyonu */}
      <div className="sticky-top bg-transparent p-3" style={{ zIndex: 1020 }}>
        <h2 className="text-primary">Okul Listesi</h2>
        <Link to="/schools/new" className="btn btn-success btn-sm">
          <FaPlusCircle /> Yeni Okul Ekle
        </Link>
      </div>

      {/* Okul Listesi Tablosu */}
      <div style={{ marginTop: '20px' }}>
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="thead-dark">
            <tr>
              <th scope="col"></th>
              <th scope="col">Okul Adı</th>
              <th scope="col">Adres</th>
              <th scope="col">Kayıt Tarihi</th>
              <th scope="col" className="text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {schools.length > 0 ? (
              schools.map((school, index) => (
                <tr key={school._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{school.name}</td>
                  <td>{school.location}</td>
                  <td>{moment(school.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                  <td className="text-center">
                    <Link to={`/schools/edit/${school._id}`} className="btn btn-primary btn-sm mr-2">
                      <FaEdit /> Düzenle
                    </Link>
                    <button 
                      onClick={() => handleDelete(school._id)} 
                      className="btn btn-danger btn-sm"
                    >
                      <FaTrashAlt /> Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Kayıtlı Okul Bulunamadı</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Silme Onayı Modalı */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Okulu Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bu Okulu silmek istediğinize emin misiniz?</Modal.Body>
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

export default SchoolList;

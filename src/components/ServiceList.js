import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import moment from 'moment';
import { Snackbar, Alert } from '@mui/material';

function ServiceList() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [open, setOpen] = useState(false);
  const [message,setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('https://service-management-system-001298c64913.herokuapp.com/services')
      .then(response => {
        const serviceData = response.data;
        const schoolRequests = serviceData.map(service => 
          axios.get(`https://service-management-system-001298c64913.herokuapp.com/schools/${service.schoolId}`)
            .then(schoolResponse => schoolResponse.data.name)
            .catch(() => 'Okul Silinmiş')
        );
        return Promise.all(schoolRequests).then(schoolNames => {
          const servicesWithSchoolNames = serviceData.map((service, index) => ({
            ...service,
            schoolName: schoolNames[index]
          }));
          setServices(servicesWithSchoolNames);
        });
      })
      .catch(error => console.error('Veri çekme hatası:', error));
  }, []);

  useEffect(() => {
    if (location.state?.success) {
        console.log('TESTTT',location.state)
        setMessage(location.state?.message)
      setOpen(true);
      navigate('/services', { replace: true, state: {} }); // Snackbar'ı gösterdikten sonra state'i temizle
    }
  }, [location.state, navigate]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id) => {
    setSelectedService(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`https://service-management-system-001298c64913.herokuapp.com/services/${selectedService}`)
      .then(response => {
        setServices(services.filter(service => service._id !== selectedService));
        setShowModal(false);
      })
      .catch(error => console.error('Silme hatası:', error));
  };

  return (
    <div className="container mt-5">
      <div className="sticky-top bg-transparent p-3" style={{ zIndex: 1020 }}>
        <h2 className="text-primary">Servis Listesi</h2>
        <Link to="/services/new" className="btn btn-success btn-sm">
          <FaPlusCircle /> Yeni Servis Ekle
        </Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="thead-dark">
            <tr>
              <th scope="col"></th>
              <th scope="col">Plaka</th>
              <th scope="col">Okul</th>
              <th scope='col'>Kayıt Tarihi</th>
              <th scope="col" className="text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <th scope="row">{index + 1}</th>
                <td>{service.plate}</td>
                <td>{service.schoolName}</td>
                <td>{moment(service.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                <td className="text-center">
                  <Link to={`/services/edit/${service._id}`} className="btn btn-primary btn-sm mr-2">
                    <FaEdit /> Düzenle
                  </Link>
                  <button 
                    onClick={() => handleDelete(service._id)} 
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
          <Modal.Title>Servisi Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bu Servisi silmek istediğinize emin misiniz?</Modal.Body>
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

export default ServiceList;

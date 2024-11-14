import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert, Button } from '@mui/material';

function UpdateSchoolForm() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState(''); // addrees -> address olarak düzeltildi
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // URL parametresinden okul ID'sini al

  useEffect(() => {
    // Okul bilgilerini al ve formu doldur
    axios.get(`https://service-management-system-001298c64913.herokuapp.com/schools/${id}`)
      .then(response => {
        console.log('sss',response.data)
        setName(response.data.name);
        setLocation(response.data.location); // addrees -> address olarak düzeltildi
      })
      .catch(error => {
        console.error('Veri getirme hatası:', error);
        setErrorMessage('Okul bilgileri alınamadı.');
        setOpen(true);
      });
  }, [id]); // id dependency olarak eklendi

  const handleClick = (message) => {
    setErrorMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location) { // addrees -> address olarak düzeltildi
      handleClick('Lütfen tüm alanları doldurun.');
      return;
    }

    const school = { name, location }; // addrees -> address olarak düzeltildi
    axios.put(`https://service-management-system-001298c64913.herokuapp.com/schools/${id}`, school)
      .then(response => {
        console.log('Okul güncellendi:', response.data);
        navigate('/schools', { state: { success: true, message: 'Okul başarıyla güncellendi!' } });
      })
      .catch(error => {
        console.error('Güncelleme hatası:', error);
        handleClick('Okul güncellenirken bir hata oluştu.');
      });
  };

  const handleCancel = () => {
    navigate('/schools'); // Okul listesine yönlendir
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center mb-4">Okulu Güncelle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Okul Adı:</label>
          <input 
            type="text" 
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label>Okul Adresi:</label>
          <input 
            type="text" 
            className="form-control"
            value={location} // addrees -> address olarak düzeltildi
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
<div className="d-flex justify-content-between">
          <Button type="submit" variant="contained" color="primary" style={{ width: '45%', height:'3%' }}>
            Güncelle
          </Button>
          <Button type="button" variant="contained" color="primary" onClick={handleCancel} style={{ width: '45%', height:'3%' }}>
            İptal
          </Button>
        </div>      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UpdateSchoolForm;

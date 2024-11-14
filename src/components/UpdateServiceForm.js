import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert, Button } from '@mui/material';

function UpdateServiceForm() {
  const [plate, setPlate] = useState('');
  const [schoolId, setSchool] = useState('');
  const [schools, setSchools] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // URL parametresinden servis ID'sini al

  useEffect(() => {
    // Servis bilgilerini al ve formu doldur
    axios.get(`http://localhost:5001/services/${id}`)
      .then(response => {
        setPlate(response.data.plate);
        setSchool(response.data.schoolId);
      })
      .catch(error => {
        console.error('Veri getirme hatası:', error);
        setErrorMessage('Servis bilgileri alınamadı.');
        setOpen(true);
      });

    // Okul listesini al
    axios.get('http://localhost:5001/schools')
      .then(response => {
        setSchools(response.data);
      })
      .catch(error => console.error('Okul bilgileri getirme hatası:', error));
  }, [id]);

  const handleClick = (message) => {
    setErrorMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plate || !schoolId || schoolId === '') {
      handleClick('Lütfen tüm alanları doldurun.');
      return;
    }

    // Geçerli bir schoolId olup olmadığını kontrol et
    const validSchool = schools.find(school => school._id === schoolId);
    if (!validSchool) {
      handleClick('Lütfen tüm alanları doldurun.');
      return;
    }

    const service = { plate, schoolId };
    axios.put(`http://localhost:5001/services/${id}`, service)
      .then(response => {
        console.log('Servis güncellendi:', response.data);
        navigate('/services', { state: { success: true, message: 'Servis başarıyla güncellendi!' } });
      })
      .catch(error => {
        console.error('Güncelleme hatası:', error);
        handleClick('Servis güncellenirken bir hata oluştu.');
      });
  };

  const handleCancel = () => {
    navigate('/services'); // Servis listesine yönlendir
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center mb-4">Servisi Güncelle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Servis Plaka:</label>
          <input 
            type="text" 
            className="form-control"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label>Okul:</label>
          <select 
            className="form-control"
            value={schoolId}
            onChange={(e) => setSchool(e.target.value)}
          >
            <option value="">Okul Seçin</option>
            {schools.map((school) => (
              <option key={school._id} value={school._id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex justify-content-between">
          <Button type="submit" variant="contained" color="primary" style={{ width: '45%', height:'3%' }}>
            Güncelle
          </Button>
          <Button type="button" variant="contained" color="primary" onClick={handleCancel} style={{ width: '45%', height:'3%' }}>
            İptal
          </Button>
        </div>       
      </form>
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

export default UpdateServiceForm;

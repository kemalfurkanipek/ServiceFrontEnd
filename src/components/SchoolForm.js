import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar, Alert } from '@mui/material'; // Snackbar ve Alert bileşenlerini import et

function SchoolForm() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
   

    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location) {
        handleClick()
        return;
      }
    const school = { name, location};
    axios.post('https://service-backend-fawn.vercel.app/?vercelToolbarCode=BVD4sv2FgiQr6dU/schools', school)
      .then(response => {
        console.log('Okul eklendi:', response.data);
        navigate('/schools',{ state: { success: true, message: 'Okul Başarıyla Eklendi.' } });  // Öğrenci listesine yönlendir
      })
      .catch(error => console.error('Ekleme hatası:', error));
  };

  const handleCancel = () => {
    navigate('/schools'); // Okul listesine yönlendir
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center mb-4">Yeni Okul Ekle</h2>
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
          <label>Adres:</label>
          <input 
            type="text" 
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)} 
          />
        </div>
        <div className="d-flex justify-content-between">
          <Button type="submit" variant="contained" color="primary" style={{ width: '45%', height:'3%' }}>
            Ekle
          </Button>
          <Button type="button" variant="contained" color="primary" onClick={handleCancel} style={{ width: '45%', height:'3%' }}>
            İptal
          </Button>
        </div>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Sağ üst köşe için ayar
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Lütfen Tüm Alanları Doldurunuz!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SchoolForm;

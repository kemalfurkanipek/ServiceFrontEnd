import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar, Alert } from '@mui/material'; // Snackbar ve Alert bileşenlerini import et

function ServiceForm() {
  const [plate, setPlate] = useState('');
  const [schoolId, setSchool] = useState('');
  const [schools, setSchools] = useState([]); // Okulları tutmak için bir state
  const [open,setOpen] = useState(false)
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
   

    setOpen(false);
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (!plate || !schoolId) {
        handleClick()
        return;
      }
    const service = { plate, schoolId };
    axios.post('https://service-backend-fawn.vercel.app/services', service)
      .then(response => {
        console.log('Servis eklendi:', response.data);
        navigate('/services',{ state: { success: true, message: 'Servis Başarıyla Eklendi.' } });  // Servis listesine yönlendir
      })
      .catch(error => console.error('Ekleme hatası:', error));
  };
  const handleCancel = () => {
    navigate('/services'); // Okul listesine yönlendir
  };
  useEffect(() => {
    axios.get('https://service-backend-fawn.vercel.app/schools')
      .then(response => {
        setSchools(response.data); // Okulları state'e kaydet
      })
      .catch(error => console.error('Getirme hatası:', error));
  }, []);

  return (
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center mb-4">Yeni Servis Ekle</h2>
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
            Ekle
          </Button>
          <Button type="button" variant="contained" color="primary" onClick={handleCancel} style={{ width: '45%', height:'3%' }}>
            İptal
          </Button>
        </div>      </form>
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

export default ServiceForm;

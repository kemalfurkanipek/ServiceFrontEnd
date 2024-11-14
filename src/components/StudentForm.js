import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar, Alert } from '@mui/material'; // Snackbar ve Alert bileşenlerini import et

function StudentForm() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [schoolId, setSchool] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [schools, setSchools] = useState([]); // Okulları tutmak için bir state
  const [services, setServices] = useState([]);
  const [open,setOpen] = useState(false)
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
   

    setOpen(false);
  };

  const handleSubmit = (e) => {
    console.log('KEMALLLLCC',address)
    e.preventDefault();
    if (!name || !surname || !address || !telephone || !schoolId || !serviceId) {
        handleClick()
        return;
      }
    const student = { name, surname, address, telephone, schoolId, serviceId };
    console.log('GÖNDERİLEN',student)
    axios.post('http://localhost:5001/students', student)
      .then(response => {
        console.log('Öğrenci eklendi:', response.data);
        navigate('/students',{ state: { success: true, message: 'Öğrenci Başarıyla Eklendi.' } });  // Servis listesine yönlendir
      })
      .catch(error => console.error('Ekleme hatası:', error));
  };
  const handleCancel = () => {
    navigate('/students'); // Okul listesine yönlendir
  };
  useEffect(() => {
    axios.get('http://localhost:5001/schools')
      .then(response => {
        setSchools(response.data); // Okulları state'e kaydet
      })
      .catch(error => console.error('Getirme hatası:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5001/services')
      .then(response => {
        setServices(response.data); // Okulları state'e kaydet
      })
      .catch(error => console.error('Getirme hatası:', error));
  }, []);

  return (
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center mb-4">Yeni Öğrenci Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Öğrenci Adı:</label>
          <input 
            type="text" 
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
             
          />
        </div>
        <div className="form-group mb-3">
          <label>Öğrenci Soyadı:</label>
          <input 
            type="text" 
            className="form-control"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
             
          />
        </div>
        <div className="form-group mb-3">
          <label>Adres:</label>
          <input 
            type="text" 
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
             
          />
        </div>
        <div className="form-group mb-3">
          <label>Telefon:</label>
          <input 
            type="text" 
            className="form-control"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
             
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
        <div className="form-group mb-3">
          <label>Servis:</label>
          <select 
            className="form-control"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            
          >
            <option value="">Okul Seçin</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.plate}
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

export default StudentForm;

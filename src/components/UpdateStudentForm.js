import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert, Button } from '@mui/material';

function UpdateStudentForm() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [schools, setSchools] = useState([]);
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // URL parametresinden öğrenci ID'sini al

  useEffect(() => {
    // Okul ve servis listesini al
    axios.get('https://service-backend-fawn.vercel.app/schools')
      .then(response => {
        setSchools(response.data);
      })
      .catch(error => console.error('Okul bilgileri getirme hatası:', error));
    
    axios.get('https://service-backend-fawn.vercel.app/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => console.error('Servis bilgileri getirme hatası:', error));
    
    // Öğrenci bilgilerini al ve formu doldur
    axios.get(`https://service-backend-fawn.vercel.app/students/${id}`)
      .then(response => {
        const student = response.data;
        console.log('STUDENT', student);
        setName(student.name);
        setSurname(student.surname);
        setAddress(student.address);
        setTelephone(student.telephone);
        setSchoolId(student.schoolId); // Mevcut değer set ediliyor
        setServiceId(student.serviceId); // Mevcut değer set ediliyor
      })
      .catch(error => {
        console.error('Öğrenci bilgisi getirme hatası:', error);
        setErrorMessage('Öğrenci bilgileri alınamadı.');
        setOpen(true);
      });
  }, [id]);

  useEffect(() => {
    // Okullar ve öğrenci yüklendiğinde schoolId'yi doğrula
    if (schools.length > 0 && schoolId) {
      const isValidSchool = schools.some(school => school._id === schoolId);
      if (!isValidSchool) setSchoolId(''); // Eğer geçerli değilse, varsayılan değeri kullan
    }
  }, [schools, schoolId]);

  useEffect(() => {
    // Servisler ve öğrenci yüklendiğinde serviceId'yi doğrula
    if (services.length > 0 && serviceId) {
      const isValidService = services.some(service => service._id === serviceId);
      if (!isValidService) setServiceId(''); // Eğer geçerli değilse, varsayılan değeri kullan
    }
  }, [services, serviceId]);

  const handleClick = (message) => {
    setErrorMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !surname || !address || !telephone || !schoolId || !serviceId) {
      handleClick('Lütfen tüm alanları doldurun.');
      return;
    }

    const student = { name, surname, address, telephone, schoolId, serviceId };

    axios.put(`https://service-backend-fawn.vercel.app/students/${id}`, student)
      .then(response => {
        console.log('Öğrenci güncellendi:', response.data);
        navigate('/students', { state: { success: true, message: 'Öğrenci başarıyla güncellendi!' } });
      })
      .catch(error => {
        console.error('Güncelleme hatası:', error);
        handleClick('Öğrenci güncellenirken bir hata oluştu.');
      });
  };

  const handleCancel = () => {
    navigate('/students'); // Öğrenci listesine yönlendir
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center mb-4">Öğrenciyi Güncelle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Ad:</label>
          <input 
            type="text" 
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label>Soyad:</label>
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
            value={schoolId} // Mevcut değerin kontrolü
            onChange={(e) => setSchoolId(e.target.value)}
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
            value={serviceId} // Mevcut değerin kontrolü
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Servis Seçin</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.plate}
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

export default UpdateStudentForm;

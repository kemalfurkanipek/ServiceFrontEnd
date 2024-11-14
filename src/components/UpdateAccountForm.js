import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert, Button } from '@mui/material';

function UpdateAccountForm() {
  const [studentId, setStudentId] = useState('');
  const [totalDebt, setTotalDebt] = useState(9000);
  const [remainingDebt, setRemainingDebt] = useState(9000);
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`https://service-management-system-001298c64913.herokuapp.com/accounts/${id}`)
      .then(response => {
        const account = response.data;
        setStudentId(account.studentId);
        setTotalDebt(account.totalDebt);
        setRemainingDebt(account.remainingDebt);
        
        // Güncelleme: Ödeme tutarlarını sayıya dönüştürerek ayarladık.
        const formattedPayments = account.monthlyPayments.map(payment => ({
          ...payment,
          amountPaid: Number(payment.amountPaid), // amountPaid değerini number olarak set ettik.
        }));
        setMonthlyPayments(formattedPayments);
      })
      .catch(error => {
        console.error('Hesap bilgisi getirme hatası:', error);
        setErrorMessage('Hesap bilgileri alınamadı.');
        setOpen(true);
      });
  }, [id]);
  

  useEffect(() => {
    const paidAmount = monthlyPayments.reduce((sum, payment) => payment.paid ? sum + payment.amountPaid : sum, 0);
    setRemainingDebt(totalDebt - paidAmount);
  }, [totalDebt, monthlyPayments]);

  const handleClick = (message) => {
    setErrorMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePaymentChange = (index, field, value) => {
    const newPayments = [...monthlyPayments];
  
    if (field === 'paid') {
      newPayments[index][field] = value;
      if (!value) {
        newPayments[index].amountPaid = 0;
        newPayments[index].receiptNumber = '';
      }
    } else {
      newPayments[index][field] = field === 'amountPaid' ? Number(value) : value; // `amountPaid` değerini sayıya dönüştürdük.
    }
  
    setMonthlyPayments(newPayments);
  
    // Kalan borcu doğru hesaplamak için ödenen tutarı sayıya dönüştürüyoruz.
    const paidAmount = newPayments.reduce((sum, payment) => payment.paid ? sum + Number(payment.amountPaid) : sum, 0);
    setRemainingDebt(totalDebt - paidAmount);
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId) {
      handleClick('Lütfen bir öğrenci seçin.');
      return;
    }

    for (const payment of monthlyPayments) {
      if (payment.paid && (payment.amountPaid <= 0 || payment.receiptNumber.trim() === '')) {
        handleClick('Tüm ödendi olan ödemeler için tutar ve fiş numarası zorunludur.');
        return;
      }
    }

    const accountData = {
      studentId,
      totalDebt,
      remainingDebt,
      monthlyPayments,
    };

    axios.put(`https://service-management-system-001298c64913.herokuapp.com/accounts/${id}`, accountData)
      .then(response => {
        console.log('Hesap güncellendi:', response.data);
        navigate('/accounts', { state: { success: true, message: 'Hesap başarıyla güncellendi!' } });
      })
      .catch(error => {
        console.error('Güncelleme hatası:', error);
        handleClick('Hesap güncellenirken bir hata oluştu.');
      });
  };

  const handleCancel = () => {
    navigate('/accounts');
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center mb-4">Hesabı Güncelle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Öğrenci:</label>
          <select
            className="form-control"
            value={studentId}
            disabled
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Öğrenci Seçin</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} {student.surname}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mb-3">
          <label>Toplam Borç:</label>
          <input
            type="number"
            className="form-control"
            value={totalDebt}
            readOnly
          />
        </div>
        <div className="form-group mb-3">
          <label>Kalan Borç:</label>
          <input
            type="number"
            className="form-control"
            value={remainingDebt}
            readOnly
          />
        </div>

        <div className="form-group mb-3">
          <label>Aylık Ödemeler:</label>
          {monthlyPayments.map((payment, index) => (
            <div key={index} className="mb-2">
              <label>Ay {payment.month}</label>
              <input
                type="checkbox"
                checked={payment.paid}
                onChange={(e) => handlePaymentChange(index, 'paid', e.target.checked)}
              />{' '}
              Ödendi
              <input
                type="number"
                className="form-control"
                value={payment.amountPaid}
                onChange={(e) => handlePaymentChange(index, 'amountPaid', e.target.value)}
                disabled={!payment.paid}
              />
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Fiş Numarası"
                value={payment.receiptNumber || ''}
                onChange={(e) => handlePaymentChange(index, 'receiptNumber', e.target.value)}
                disabled={!payment.paid}
              />
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between">
          <Button type="submit" variant="contained" color="primary" style={{ width: '45%', height: '3%' }}>
            Güncelle
          </Button>
          <Button type="button" variant="contained" color="primary" onClick={handleCancel} style={{ width: '45%', height: '3%' }}>
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

export default UpdateAccountForm;

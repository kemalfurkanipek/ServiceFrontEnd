import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert, Button } from '@mui/material';

function AccountForm() {
  const [studentId, setStudentId] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState(1000); // Aylık tutar
  const [totalDebt, setTotalDebt] = useState(9000); // Toplam borç artık hesaplanacak
  const [remainingDebt, setRemainingDebt] = useState(9000);
  const [discountAmount, setDiscountAmount] = useState(0); // İndirim tutarı
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // URL parametresinden hesap ID'sini al

  useEffect(() => {
    axios.get('https://service-backend-chi.vercel.app/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => console.error('Öğrenci bilgilerini getirme hatası:', error));

    if (id) {
      axios.get(`https://service-backend-chi.vercel.app/accounts/${id}`)
        .then(response => {
          const account = response.data;
          setStudentId(account.studentId);
          setMonthlyAmount(account.totalDebt / 9);
          setTotalDebt(account.totalDebt);
          setRemainingDebt(account.remainingDebt);
          setDiscountAmount(account.discountAmount || 0); // İndirim tutarını alıyoruz
          setMonthlyPayments(account.monthlyPayments);
        })
        .catch(error => {
          console.error('Hesap bilgisi getirme hatası:', error);
          setErrorMessage('Hesap bilgileri alınamadı.');
          setOpen(true);
        });
    } else {
      const defaultMonthlyPayments = Array.from({ length: 9 }, (_, i) => ({
        month: i + 1,
        paid: false,
        amountPaid: 0,
        receiptNumber: '',
      }));
      setMonthlyPayments(defaultMonthlyPayments);
    }
  }, [id]);

  useEffect(() => {
    const newTotalDebt = (monthlyAmount * 9) - discountAmount;
    setTotalDebt(newTotalDebt > 0 ? newTotalDebt : 0); // Toplam borç, indirim düşüldükten sonra pozitif kalmalı
  }, [monthlyAmount, discountAmount]);

  // Hem toplam borç hem de ödenmiş tutarlara bağlı olarak kalan borcu hesaplayan useEffect
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
      if (value) {
        newPayments[index].amountPaid = monthlyAmount; // Ödendi işaretlendiğinde aylık tutarı otomatik doldur
      } else {
        newPayments[index].amountPaid = 0; // İşaret kaldırılınca miktarı sıfırla
      }
    } else if (field === 'receiptNumber') {
      newPayments[index][field] = value;
    } else {
      newPayments[index][field] = parseFloat(value);
    }

    setMonthlyPayments(newPayments);

    const updatedRemainingDebt = totalDebt - newPayments.reduce((sum, payment) => payment.paid ? sum + payment.amountPaid : sum, 0);
    setRemainingDebt(updatedRemainingDebt);
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

    const paidAmount = monthlyPayments.reduce((sum, payment) => payment.paid ? sum + payment.amountPaid : sum, 0);
    const accountData = {
      studentId,
      totalDebt,
      remainingDebt: id ? remainingDebt : totalDebt - paidAmount,
      monthlyPayments,
      discountAmount, // İndirim tutarını kaydediyoruz
    };

    if (id) {
      axios.put(`https://service-backend-chi.vercel.app/accounts/${id}`, accountData)
        .then(response => {
          navigate('/accounts', { state: { success: true, message: 'Hesap başarıyla güncellendi!' } });
        })
        .catch(error => {
          console.error('Güncelleme hatası:', error);
          handleClick('Hesap güncellenirken bir hata oluştu.');
        });
    } else {
      axios.post('https://service-backend-chi.vercel.app/accounts', accountData)
        .then(response => {
          navigate('/accounts', { state: { success: true, message: 'Hesap başarıyla eklendi!' } });
        })
        .catch(error => {
          console.error('Ekleme hatası:', error);
          handleClick('Hesap eklenirken bir hata oluştu.');
        });
    }
  };

  const handleCancel = () => {
    navigate('/accounts');
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center mb-4">{id ? 'Hesabı Güncelle' : 'Yeni Hesap Ekle'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Öğrenci:</label>
          <select
            className="form-control"
            value={studentId}
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
          <label>Aylık Tutar:</label>
          <input
            type="number"
            className="form-control"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(parseFloat(e.target.value))}
          />
        </div>

        <div className="form-group mb-3">
          <label>İndirim Tutarı:</label>
          <input
            type="number"
            className="form-control"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(parseFloat(e.target.value))}
          />
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
            <div key={index} className="mb-3">
              <label>Ay {payment.month}</label>
              <div>
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
                  disabled={!payment.paid} // Eğer ödeme yapılmamışsa miktar girilemez
                />
              </div>
              <div className="mt-2">
                <label>Fiş Numarası:</label>
                <input
                  type="text"
                  className="form-control"
                  value={payment.receiptNumber}
                  onChange={(e) => handlePaymentChange(index, 'receiptNumber', e.target.value)}
                  disabled={!payment.paid} // Ödeme yapılmadıysa fiş numarası girilemez
                />
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between">
          <Button type="submit" variant="contained" color="primary" style={{ width: '45%', height: '3%' }}>
            {id ? 'Güncelle' : 'Ekle'}
          </Button>
          <Button type="button" variant="contained" color="secondary" onClick={handleCancel} style={{ width: '45%', height: '3%' }}>
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

export default AccountForm;

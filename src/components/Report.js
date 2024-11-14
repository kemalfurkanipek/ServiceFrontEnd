import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Report() {
  const [selectedMonth, setSelectedMonth] = useState(''); // Seçilen ay
  const [reportData, setReportData] = useState([]); // Filtrelenmiş rapor verisi
  const [accounts, setAccounts] = useState([]); // Tüm account verisi
  const [showReport, setShowReport] = useState(false); // Raporu gösterip göstermemek için state

  useEffect(() => {
    // Tüm hesapları getirme
    axios.get('https://service-backend-fawn.vercel.app/accounts')
      .then(response => {
        setAccounts(response.data); // Tüm hesapları getir, ama filtrelemeyi butona basınca yap
      })
      .catch(error => console.error('Veri çekme hatası:', error));
  }, []);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value)); // Ay seçimini güncelle (integer olarak)
    setShowReport(false); // Ay seçilince raporu gizle
  };

  const generateReport = () => {
    // Eğer ay seçilmemişse uyarı göster
    if (!selectedMonth) {
      alert('Lütfen bir ay seçiniz.');
      return;
    }

    // Seçilen aya göre ödeme durumu false olanları filtreleme
    const filteredAccounts = accounts.filter(account => {
      return account.monthlyPayments.some(payment => 
        payment.month === selectedMonth && payment.paid === false
      );
    });
    
    // Rapora gerekli bilgileri ekleme (ödenmemiş hesaplar ve tutarları)
    const reportData = filteredAccounts.map(account => {
      const unpaidPayments = account.monthlyPayments.filter(payment => 
        payment.month === selectedMonth && payment.paid === false
      );
      

      console.log('TEST',account,account.totalDebt)
      // Öğrencinin toplam borcunu hesapla
      const totalUnpaidAmount = account.totalDebt
      console.log('TOTAL',totalUnpaidAmount)
      const dividedUnpaidAmount = (Number(totalUnpaidAmount) / 9).toFixed(2); // 9'a böl ve virgülden sonra 2 basamak göster
        console.log('DEĞER',dividedUnpaidAmount)
      return {
        student: `${account.studentId?.name} ${account.studentId?.surname}`,
        unpaidPayments: unpaidPayments.map(payment => ({
          month: payment.month,
          amount: payment.amountPaid,
        })),
        dividedUnpaidAmount, // Toplam borcu 9'a böldük
      };
    });
    console.log('REPORT ',reportData)
    setReportData(reportData); // Filtrelenmiş raporu set et
    setShowReport(true); // Raporu göster
  };

  let motnhOfNumber = {
    1: 'Eylül',
    2: 'Ekim',
    3: 'Kasım',
    4: 'Aralık',
    5: 'Ocak',
    6: 'Şubat',
    7: 'Mart',
    8: 'Nisan',
    9: 'Mayıs'
  }

  return (
    <div className="container mt-5">
      <h2 className="text-primary">Aylık Rapor</h2>

      {/* Ay Seçme */}
      <Form.Group controlId="formMonth">
        <Form.Label>Ay Seçin</Form.Label>
        <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange}>
          <option value="">Seçiniz...</option>
          <option value="1">Eylül</option>
          <option value="2">Ekim</option>
          <option value="3">Kasım</option>
          <option value="4">Aralık</option>
          <option value="5">Ocak</option>
          <option value="6">Şubat</option>
          <option value="7">Mart</option>
          <option value="8">Nisan</option>
          <option value="9">Mayıs</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" onClick={generateReport} className="mt-3">
        Raporu Getir
      </Button>

      {/* Rapor Tablosu */}
      {showReport && reportData.length > 0 && (
        <div className="mt-5">
          <h4>{motnhOfNumber[selectedMonth]} Ayı için Ödeme Yapmamış Öğrenciler</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Öğrenci</th>
                <th>Ay</th>
                <th>Aylık Borç Tutarı (TL)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((data, index) => (
                <tr key={index}>
                  <td>{data.student}</td>
                  <td>
                    {data.unpaidPayments.map((payment, idx) => (
                      <div key={idx}>{motnhOfNumber[payment.month]}</div>
                    ))}
                  </td>
                  <td>
                    {/* Bölünmüş aylık borcu göster */}
                    <div>{data.dividedUnpaidAmount} TL</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Eğer ödenmemiş hesap yoksa */}
      {showReport && reportData.length === 0 && selectedMonth && (
        <div className="mt-5">
          <h5>{selectedMonth}. ay için ödenmemiş hesap bulunamadı.</h5>
        </div>
      )}
    </div>
  );
}

export default Report;

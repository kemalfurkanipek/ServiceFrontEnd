import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button, Accordion, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt, FaWhatsapp } from 'react-icons/fa';
import { Snackbar, Alert } from '@mui/material';
import * as XLSX from 'xlsx';
 

function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [schools, setSchools] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [filterBySchool, setFilterBySchool] = useState(false);
  const [filterByService, setFilterByService] = useState(false);
  const [filterByStudent,setFilterByStudent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [whatsAppModal, setWhatsAppModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [totalDebtFilter, setTotalDebtFilter] = useState('');
  const [remainingDebtFilter, setRemainingDebtFilter] = useState('');
  const [showNameTooltip, setShowNameTooltip] = useState(false);
  const [showTotalDebtTooltip, setShowTotalDebtTooltip] = useState(false);
  const [showRemainingDebtTooltip, setShowRemainingDebtTooltip] = useState(false);
  const [excelData,setExcelData] = useState([]);
  const [excel,setExcel] = useState(false);
  const nameButtonRef = useRef(null);
  const totalDebtButtonRef = useRef(null);
  const remainingDebtButtonRef = useRef(null);
  const nameTooltipRef = useRef(null);
  const totalDebtTooltipRef = useRef(null);
  const remainingDebtTooltipRef = useRef(null);

  

  const exportToExcel = () => {
    // Excel için çalışacak veriyi hazırlama
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Kenarlık stili tanımlama
    const borderStyle = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    // Veriye kenarlık ekleme
    Object.keys(ws).forEach((cell) => {
        if (cell[0] === '!') return; // '!' işareti metadata alanları içindir, bu hücrelere işlem yapma
        const cellValue = ws[cell];

        // Her hücreye kenarlık ekle
        cellValue.s = cellValue.s || {}; // Hücrede stil varsa, varsa ekle, yoksa boş bir stil nesnesi oluştur
        cellValue.s.border = borderStyle;
    });

    // Sütun genişliklerini ayarlama
    const wscols = [];
    excelData.forEach((row) => {
      Object.keys(row).forEach((key, index) => {
        // Eğer o sütunda genişlik yoksa, içerik uzunluğuna göre bir değer ekle
        const cellValue = String(row[key] || '');
        const columnIndex = wscols[index] || 0;
        wscols[index] = Math.max(columnIndex, cellValue.length);
      });
    });

    // Sütun genişliklerini uygula
    ws['!cols'] = wscols.map((width) => ({ wpx: width * 10 })); // 10px olarak genişliği ayarlayın

    // Çalışma kitabını oluşturma
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Excel dosyasını indirme
    XLSX.writeFile(wb, 'data.xlsx');
};



  useEffect(() => {
    axios.get('https://service-backend-fawn.vercel.app/accounts')
      .then(response => {
        setAccounts(response.data);
        setFilteredAccounts(response.data);
      })
      .catch(error => console.error('Veri çekme hatası:', error));

    axios.get('https://service-backend-fawn.vercel.app/schools')
      .then(response => setSchools(response.data))
      .catch(error => console.error('Okullar çekme hatası:', error));

    axios.get('https://service-backend-fawn.vercel.app/services')
      .then(response => setServices(response.data))
      .catch(error => console.error('Servisler çekme hatası:', error));
  }, []);

  const filterNotAccounts = () => {
      setFilterBySchool(false)
      setFilterByStudent(false)
      setFilterByService(false)
      setNameFilter('')
      setExcel(false)
      
  }

  const filterAccounts = () => {
    let filtered = accounts;
    setExcel(false)
    if (nameFilter) {
      setExcel(true)
      filtered = filtered.filter(account =>
        account.studentId?.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        account.studentId?.surname.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (totalDebtFilter) {
      setExcel(true)
      filtered = filtered.filter(account =>
        account.totalDebt.toString().includes(totalDebtFilter)
      );
    }

    if (remainingDebtFilter) {
      setExcel(true)
      filtered = filtered.filter(account =>
        account.remainingDebt.toString().includes(remainingDebtFilter)
      );
    }

    if (filterBySchool && selectedSchool) {
      setExcel(true)
      filtered = filtered.filter(account => account.studentId?.schoolId === selectedSchool);
    } else if (filterByService && selectedService) {
      setExcel(true)
      filtered = filtered.filter(account => account.studentId?.serviceId === selectedService);
    }

    let excelDataNew = [];
    console.log('Filtered SON --->',filtered)

    filtered.map((item,index) =>{
        excelDataNew.push({
          'sıra no': index +1,
          'öğrenci ismi': item.studentId.name + item.studentId.surname,
          'tel': item.studentId.telephone,
          '1.Ay': item.monthlyPayments[0].amountPaid !== 0 ? item.monthlyPayments[0].amountPaid : '',
          '2.Ay': item.monthlyPayments[1].amountPaid !== 0 ? item.monthlyPayments[1].amountPaid : '',
          '3.Ay': item.monthlyPayments[2].amountPaid !== 0 ? item.monthlyPayments[2].amountPaid : '',
          '4.Ay': item.monthlyPayments[3].amountPaid !== 0 ? item.monthlyPayments[3].amountPaid : '',
          '5.Ay': item.monthlyPayments[4].amountPaid !== 0 ? item.monthlyPayments[4].amountPaid : '',
          '6.Ay': item.monthlyPayments[5].amountPaid !== 0 ? item.monthlyPayments[5].amountPaid : '',
          '7.Ay': item.monthlyPayments[6].amountPaid !== 0 ? item.monthlyPayments[6].amountPaid : '',
          '8.Ay': item.monthlyPayments[7].amountPaid !== 0 ? item.monthlyPayments[7].amountPaid : '',
          '9.Ay': item.monthlyPayments[8].amountPaid !== 0 ? item.monthlyPayments[8].amountPaid : '',
        })
    })
    setExcelData(excelDataNew)
    setFilteredAccounts(filtered);
  };

  const handleCheckboxChange = (type) => {
    if (type === 'school') {
      setFilterBySchool(!filterBySchool);
      setFilterByService(false);
      setFilterByStudent(false)
      setSelectedService('');
      setNameFilter('')
    } else if (type === 'service') {
      setFilterByService(!filterByService);
      setFilterBySchool(false);
      setFilterByStudent(false)
      setSelectedSchool('');
      setNameFilter('')
    } else if (type === 'student') {
      setFilterByStudent(!filterByStudent)
      setFilterBySchool(false)
      setFilterByService(false)
      setSelectedSchool('')
      setSelectedService('')
    }
  };

  const handleDelete = (id) => {
    setSelectedAccount(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`https://service-backend-fawn.vercel.app/accounts/${selectedAccount}`)
      .then(response => {
        const updatedAccounts = accounts.filter(account => account._id !== selectedAccount);
        setAccounts(updatedAccounts);
        setFilteredAccounts(updatedAccounts);
        setShowModal(false);
        setMessage('Hesap başarıyla silindi.');
        setOpen(true);
      })
      .catch(error => console.error('Silme hatası:', error));
  };

  const handleWhatsAppModal = (account) => {
    setSelectedAccount(account);
    setWhatsAppModal(true);
  };

  const sendWhatsAppMessage = () => {
    if (!selectedMonth || !amount) {
      alert('Lütfen bir ay ve tutar giriniz.');
      return;
    }

    const message = `${selectedMonth} ayı için ödeme yapmanız gereken tutar ${amount} TL'dir.`;
    const phoneNumber = selectedAccount.studentId?.telephone;

    if (phoneNumber) {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }

    setWhatsAppModal(false);
    setSelectedMonth('');
    setAmount('');
  };

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nameTooltipRef.current && !nameTooltipRef.current.contains(event.target) &&
          nameButtonRef.current && !nameButtonRef.current.contains(event.target)) {
        setShowNameTooltip(false);
      }
      if (totalDebtTooltipRef.current && !totalDebtTooltipRef.current.contains(event.target) &&
          totalDebtButtonRef.current && !totalDebtButtonRef.current.contains(event.target)) {
        setShowTotalDebtTooltip(false);
      }
      if (remainingDebtTooltipRef.current && !remainingDebtTooltipRef.current.contains(event.target) &&
          remainingDebtButtonRef.current && !remainingDebtButtonRef.current.contains(event.target)) {
        setShowRemainingDebtTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container mt-5">
      <div className="sticky-top bg-green p-3" style={{ zIndex: 1020, backgroundColor:'#f2f2f2' }}>
        <h2 className="text-primary">Öğrenci Hesap Listesi</h2>
        <Link to="/accounts/new" className="btn btn-success btn-sm">
          Yeni Hesap Ekle
        </Link>

        <div className="row mt-3">
          <div className="col-md-3">
            <Form.Check 
              type="checkbox"
              label="Okula Göre Filtrele"
              checked={filterBySchool}
              onChange={() => handleCheckboxChange('school')}
            />
            {filterBySchool && (
              <Form.Group controlId="selectSchool">
                <Form.Label>Okul Seçin</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                >
                  <option value="">Tümü</option>
                  {schools.map(school => (
                    <option key={school._id} value={school._id}>{school.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
          </div>

          <div className="col-md-3">
            <Form.Check 
              type="checkbox"
              label="Servise Göre Filtrele"
              checked={filterByService}
              onChange={() => handleCheckboxChange('service')}
            />
            {filterByService && (
              <Form.Group controlId="selectService">
                <Form.Label>Servis Seçin</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Tümü</option>
                  {services.map(service => (
                    <option key={service._id} value={service._id}>{service.plate}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
          </div>

          <div className="col-md-3">
            <Form.Check 
              type="checkbox"
              label="Öğrenciye Göre Filtrele"
              checked={filterByStudent}
              onChange={() => handleCheckboxChange('student')}
            />
            {filterByStudent && (
  <Form.Group controlId="selectService">
    <Form.Label>Öğrenci</Form.Label>
    <Form.Control
      type="text"  // Text input tipi kullanıyoruz
      value={nameFilter}
      onChange={(e) => setNameFilter(e.target.value)}  // Metin girişini güncelleme
      placeholder="Öğrenci Adı Veya Soyadı"  // Placeholder eklenebilir
    />
  </Form.Group>
)}

          </div>

          <div>
            <Button variant="primary" onClick={filterAccounts}>Ara</Button>
            <Button 
  variant="primary" 
  onClick={filterNotAccounts} 
  className="ms-3"  // Bootstrap 5 için margin-start (sol) ekler
>
  Filtreleri Temizle
</Button>
{excel && (
        <Button 
          variant="primary" 
          onClick={exportToExcel} 
          className="ms-3"  // Bootstrap 5 için margin-start (sol) ekler
        >
          Excel Al
        </Button>
      )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="thead-dark">
            <tr>
              <th>Öğrenci</th>
              <th>Toplam Borç</th>
              <th>Kalan Borç</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <React.Fragment key={account._id}>
                <tr>
                  <td>{account.studentId?.name} {account.studentId?.surname}</td>
                  <td>{account.totalDebt} TL</td>
                  <td>{account.remainingDebt} TL</td>
                  <td className="text-center">
                    <Link to={`/accounts/edit/${account._id}`} className="btn btn-primary btn-sm mr-2">
                      <FaEdit /> Düzenle
                    </Link>
                    <button onClick={() => handleDelete(account._id)} className="btn btn-danger btn-sm mr-2">
                      <FaTrashAlt /> Sil
                    </button>
                    <button onClick={() => handleWhatsAppModal(account)} className="btn btn-success btn-sm">
                      <FaWhatsapp /> WhatsApp
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="5">
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Aylık Ödemeler</Accordion.Header>
                        <Accordion.Body>
                          <Table bordered>
                            <thead>
                              <tr>
                                {account.monthlyPayments.map(payment => (
                                  <th key={payment.month}>Ay {payment.month}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {account.monthlyPayments.map(payment => (
                                  <td key={payment.month}>
                                    {payment.paid ? (
                                      <>
                                        Ödendi <br />
                                        {payment.amountPaid} TL <br />
                                        <strong>Fiş No: {payment.receiptNumber || 'Yok'}</strong>
                                      </>
                                    ) : (
                                      <>
                                        Ödenmedi <br />
                                        {payment.amountPaid} TL
                                      </>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hesabı Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bu hesabı silmek istediğinize emin misiniz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={whatsAppModal} onHide={() => setWhatsAppModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>WhatsApp Mesaj Gönder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMonth">
              <Form.Label>Ay Seçin</Form.Label>
              <Form.Control as="select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option value="">Seçiniz...</option>
                {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAmount" className="mt-3">
              <Form.Label>Tutar Girin</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Tutar"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setWhatsAppModal(false)}>İptal</Button>
          <Button variant="success" onClick={sendWhatsAppMessage}>Mesaj Gönder</Button>
        </Modal.Footer>
      </Modal>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AccountList;

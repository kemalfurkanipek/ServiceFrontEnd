import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button, Accordion, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt, FaWhatsapp, FaSearch } from 'react-icons/fa';
import { Snackbar, Alert } from '@mui/material';

function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]); // Filtrelenmiş hesaplar
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [whatsAppModal, setWhatsAppModal] = useState(false); // WhatsApp modal durumu
  const [selectedMonth, setSelectedMonth] = useState(''); // Seçilen ay
  const [amount, setAmount] = useState(''); // Girilen tutar
  const [nameFilter, setNameFilter] = useState(''); // Öğrenci adı filtresi
  const [totalDebtFilter, setTotalDebtFilter] = useState(''); // Toplam borç filtresi
  const [remainingDebtFilter, setRemainingDebtFilter] = useState(''); // Kalan borç filtresi

  // Tooltip kontrolü için state
  const [showNameTooltip, setShowNameTooltip] = useState(false);
  const [showTotalDebtTooltip, setShowTotalDebtTooltip] = useState(false);
  const [showRemainingDebtTooltip, setShowRemainingDebtTooltip] = useState(false);

  // Tooltip ve buton referansları
  const nameButtonRef = useRef(null);
  const totalDebtButtonRef = useRef(null);
  const remainingDebtButtonRef = useRef(null);
  const nameTooltipRef = useRef(null);
  const totalDebtTooltipRef = useRef(null);
  const remainingDebtTooltipRef = useRef(null);


  useEffect(() => {
    axios.get('http://localhost:5001/accounts')
      .then(response => {
        setAccounts(response.data);
        setFilteredAccounts(response.data); // İlk başta tüm hesaplar gösterilecek
      })
      .catch(error => console.error('Veri çekme hatası:', error));
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [nameFilter, totalDebtFilter, remainingDebtFilter]); // Filtreler değiştiğinde listeyi güncelle

  useEffect(() => {
    // Tooltip dışına tıklandığında kapatmak için event listener ekliyoruz
    const handleClickOutside = (event) => {
      if (
        // Tooltip veya butonun dışına tıklanırsa kapat
        nameTooltipRef.current && !nameTooltipRef.current.contains(event.target) &&
        nameButtonRef.current && !nameButtonRef.current.contains(event.target)
      ) {
        setShowNameTooltip(false);
      }

      if (
        totalDebtTooltipRef.current && !totalDebtTooltipRef.current.contains(event.target) &&
        totalDebtButtonRef.current && !totalDebtButtonRef.current.contains(event.target)
      ) {
        setShowTotalDebtTooltip(false);
      }

      if (
        remainingDebtTooltipRef.current && !remainingDebtTooltipRef.current.contains(event.target) &&
        remainingDebtButtonRef.current && !remainingDebtButtonRef.current.contains(event.target)
      ) {
        setShowRemainingDebtTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  const filterAccounts = () => {
    let filtered = accounts;

    if (nameFilter) {
      filtered = filtered.filter(account =>
        account.studentId?.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        account.studentId?.surname.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (totalDebtFilter) {
      filtered = filtered.filter(account =>
        account.totalDebt.toString().includes(totalDebtFilter)
      );
    }

    if (remainingDebtFilter) {
      filtered = filtered.filter(account =>
        account.remainingDebt.toString().includes(remainingDebtFilter)
      );
    }

    setFilteredAccounts(filtered); // Filtrelenmiş hesapları güncelle
  };

  const handleDelete = (id) => {
    setSelectedAccount(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:5001/accounts/${selectedAccount}`)
      .then(response => {
        // Hesabı silindikten sonra güncellenen hesap listelerini ayarlıyoruz
        const updatedAccounts = accounts.filter(account => account._id !== selectedAccount);
        setAccounts(updatedAccounts); // `accounts` listesini güncelle
        setFilteredAccounts(updatedAccounts); // `filteredAccounts` listesini de güncelle
        setShowModal(false);
        setMessage('Hesap başarıyla silindi.');
        setOpen(true);
      })
      .catch(error => console.error('Silme hatası:', error));
  };
  

  const handleWhatsAppModal = (account) => {
    setSelectedAccount(account);
    setWhatsAppModal(true); // WhatsApp modalını aç
  };

  const sendWhatsAppMessage = () => {
    if (!selectedMonth || !amount) {
      alert('Lütfen bir ay ve tutar giriniz.');
      return;
    }
    
    const message = `${selectedMonth} ayı için ödeme yapmanız gereken tutar ${amount} TL'dir.`;
    const phoneNumber = selectedAccount.studentId?.telephone; // Öğrencinin telefon numarası

    if (phoneNumber) {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank'); // Yeni bir sekmede WhatsApp URL'sini aç
    }

    setWhatsAppModal(false); // Modalı kapat
    setSelectedMonth(''); // Ay seçimini temizle
    setAmount(''); // Tutar seçimini temizle
  };

  return (
    <div className="container mt-5">
      <div className="sticky-top bg-green p-3" style={{ zIndex: 1020, backgroundColor:'#f2f2f2' }}>
        <h2 className="text-primary">Öğrenci Hesap Listesi</h2>
        <Link to="/accounts/new" className="btn btn-success btn-sm">
          Yeni Hesap Ekle
        </Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="thead-dark">
            <tr>
              <th scope="col">
                Öğrenci
                <button
                  ref={nameButtonRef}
                  className="search-button"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={() => {
                    setShowNameTooltip(!showNameTooltip);
                    setShowTotalDebtTooltip(false);
                    setShowRemainingDebtTooltip(false);
                  }}
                >
                  <FaSearch />
                </button>
                {showNameTooltip && (
                  <div
                    ref={nameTooltipRef}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ced4da',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      marginTop: '10px'
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="İsim ile filtrele"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </div>
                )}
              </th>
              <th scope="col">
                Toplam Borç
                <button
                  ref={totalDebtButtonRef}
                  className="search-button"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={() => {
                    setShowTotalDebtTooltip(!showTotalDebtTooltip);
                    setShowNameTooltip(false);
                    setShowRemainingDebtTooltip(false);
                  }}
                >
                  <FaSearch />
                </button>
                {showTotalDebtTooltip && (
                  <div
                    ref={totalDebtTooltipRef}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ced4da',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      marginTop: '10px'
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Toplam borç ile filtrele"
                      value={totalDebtFilter}
                      onChange={(e) => setTotalDebtFilter(e.target.value)}
                    />
                  </div>
                )}
              </th>
              <th scope="col">
                Kalan Borç
                <button
                  ref={remainingDebtButtonRef}
                  className="search-button"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={() => {
                    setShowRemainingDebtTooltip(!showRemainingDebtTooltip);
                    setShowNameTooltip(false);
                    setShowTotalDebtTooltip(false);
                  }}
                >
                  <FaSearch />
                </button>
                {showRemainingDebtTooltip && (
                  <div
                    ref={remainingDebtTooltipRef}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ced4da',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      marginTop: '10px'
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Kalan borç ile filtrele"
                      value={remainingDebtFilter}
                      onChange={(e) => setRemainingDebtFilter(e.target.value)}
                    />
                  </div>
                )}
              </th>
              <th scope="col" className="text-center">İşlemler</th>
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
                    <button 
                      onClick={() => handleDelete(account._id)} 
                      className="btn btn-danger btn-sm mr-2"
                    >
                      <FaTrashAlt /> Sil
                    </button>
                    <button 
                      onClick={() => handleWhatsAppModal(account)} // WhatsApp modalını aç
                      className="btn btn-success btn-sm"
                    >
                      <FaWhatsapp /> WhatsApp
                    </button>
                  </td>
                </tr>
                {/* Aylık Ödemeler İçin Accordion */}
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
                        <strong>Fiş No: {payment.receiptNumber || 'Yok'}</strong> {/* Fiş numarasını göster */}
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

      {/* Silme Modal */}
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

      {/* WhatsApp Mesaj Gönderme Modalı */}
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
                <option value="Ocak">Ocak</option>
                <option value="Şubat">Şubat</option>
                <option value="Mart">Mart</option>
                <option value="Nisan">Nisan</option>
                <option value="Mayıs">Mayıs</option>
                <option value="Haziran">Haziran</option>
                <option value="Temmuz">Temmuz</option>
                <option value="Ağustos">Ağustos</option>
                <option value="Eylül">Eylül</option>
                <option value="Ekim">Ekim</option>
                <option value="Kasım">Kasım</option>
                <option value="Aralık">Aralık</option>
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
          <Button variant="secondary" onClick={() => setWhatsAppModal(false)}>
            İptal
          </Button>
          <Button variant="success" onClick={sendWhatsAppMessage}>
            Mesaj Gönder
          </Button>
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

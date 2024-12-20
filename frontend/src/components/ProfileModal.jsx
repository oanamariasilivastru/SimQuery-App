// ProfileModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../theme/ProfileModal.css'; // Asigură-te că calea este corectă

function ProfileModal({ isOpen, onClose, onSave, initialProfile }) {
  const [name, setName] = useState(initialProfile.name || '');
  const [surname, setSurname] = useState(initialProfile.surname || '');
  const [role, setRole] = useState(initialProfile.role || '');
  const [image, setImage] = useState(initialProfile.image || '');
  
  // Câmpuri suplimentare
  const [company, setCompany] = useState(initialProfile.company || '');
  const [organization, setOrganization] = useState(initialProfile.organization || '');
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Referință pentru modal pentru a gestiona focusul
  const modalRef = useRef(null);

  // Actualizează starea când initialProfile se schimbă
  useEffect(() => {
    setName(initialProfile.name || '');
    setSurname(initialProfile.surname || '');
    setRole(initialProfile.role || '');
    setImage(initialProfile.image || '');
    setCompany(initialProfile.company || '');
    setOrganization(initialProfile.organization || '');
    setError(null);
    setSuccess(null);
  }, [initialProfile, isOpen]);

  // Focus trapping și închiderea modalului cu Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Focus trapping
      if (isOpen && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button, textarea, input, select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus pe primul element când modalul se deschide
      setTimeout(() => {
        if (modalRef.current) {
          const firstInput = modalRef.current.querySelector('input, select');
          firstInput && firstInput.focus();
        }
      }, 0);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSave = async () => {
    // Validare simplă
    if (!name.trim() || !surname.trim() || !role.trim()) {
      setError('Te rog completează toate câmpurile obligatorii.');
      setSuccess(null);
      return;
    }

    // Validări suplimentare în funcție de rol
    if (role === 'jurnalist' && !company.trim()) {
      setError('Te rog completează câmpul "Companie".');
      setSuccess(null);
      return;
    }

    if (role === 'angajat_stat' && !organization.trim()) {
      setError('Te rog completează câmpul "Organizație".');
      setSuccess(null);
      return;
    }

    const updatedProfile = { name, surname, role, image, company, organization };
    onSave(updatedProfile);

    // Trimite actualizările la backend
    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/update_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        setSuccess('Profilul a fost actualizat cu succes!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Eroare la actualizarea profilului.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Eroare la actualizarea profilului.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous URL to prevent memory leaks
      if (image && image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
      setImage(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Previne închiderea modalului când se face click în interior
        ref={modalRef}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">Profilul Meu</h2>
        <div className="profile-form">
          <div className="profile-image-section">
            {image ? (
              <img src={image} alt="Profile" className="profile-image-preview" />
            ) : (
              <div className="profile-image-placeholder">Nicio poză</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              aria-label="Încarcă o poză de profil"
            />
          </div>
          <div className="profile-fields">
            <label>
              Nume:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-required="true"
              />
            </label>
            <label>
              Prenume:
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                aria-required="true"
              />
            </label>
            <label>
              Rol:
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                aria-required="true"
              >
                <option value="">Selectează rolul</option>
                <option value="jurnalist">Jurnalist</option>
                <option value="content_creator">Creator de conținut</option>
                <option value="angajat_stat">Angajat la stat</option>
                <option value="guvern">Guvern</option>
              </select>
            </label>

            {/* Câmpuri suplimentare în funcție de rol */}
            {role === 'jurnalist' && (
              <label>
                Companie:
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  aria-required="true"
                />
              </label>
            )}

            {role === 'angajat_stat' && (
              <label>
                Organizație:
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                  aria-required="true"
                />
              </label>
            )}
          </div>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        {success && <p className="success-message" role="status">{success}</p>}
        <div className="modal-actions">
          <button
            className="modal-save-btn"
            onClick={handleSave}
            disabled={uploading}
            aria-disabled={uploading}
          >
            {uploading ? 'Se salvează...' : 'Salvează'}
          </button>
          <button
            className="modal-cancel-btn"
            onClick={onClose}
            disabled={uploading}
            aria-disabled={uploading}
          >
            Anulează
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;

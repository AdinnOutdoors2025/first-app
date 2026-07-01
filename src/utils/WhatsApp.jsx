import React from 'react';
import { whatsAppNumber } from '../Adminpanel/BASE_URL';


const WhatsApp = () => {
  // Admin WhatsApp number (include country code without '+')
  const phoneNumber = whatsAppNumber; // fallback number

  

  // Predefined message (URL encoded)
  const message = encodeURIComponent('We are reaching out via the ADINN Outdoors website.');

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Inline styles to match SalesIQ look & feel, positioned bottom-left
  const styles = {
    floatingButton: {
      position: 'fixed',
      bottom: '15%',
      right: '13px',         
      zIndex: 9999,
      backgroundColor: '#25D366', // WhatsApp green
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      border: 'none',
      outline: 'none',
    },
    icon: {
      width: '35px',
      height: '35px',
      fill: 'white',
    },
  };

  // SVG WhatsApp icon (simple version)
  const whatsappIcon = (
    <svg
      style={styles.icon}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.077 4.928C17.191 3.041 14.683 2 12.006 2 6.798 2 2.548 6.193 2.54 11.393c-.003 1.747.456 3.458 1.328 4.985L2.25 21.75l5.4-1.572c1.48.87 3.148 1.33 4.886 1.332h.004c5.19 0 9.45-4.195 9.458-9.396.004-2.51-.973-4.87-2.86-6.757zM12.052 20.11h-.003c-1.48 0-2.932-.398-4.195-1.147l-.3-.179-3.206.934.998-3.118-.195-.314a8.117 8.117 0 0 1-1.246-4.315c.007-4.48 3.648-8.12 8.14-8.12 2.174 0 4.214.85 5.75 2.39a8.055 8.055 0 0 1 2.383 5.77c-.008 4.48-3.647 8.115-8.126 8.115zM16.44 13.17c-.243-.122-1.43-.705-1.65-.785-.222-.08-.383-.122-.544.122-.162.243-.63.785-.772.946-.142.162-.284.182-.527.06-.854-.416-1.412-.74-1.98-1.206-.49-.4-.918-.87-1.26-1.396-.133-.203-.014-.312.1-.416.104-.094.232-.246.348-.37.116-.123.155-.205.232-.342.078-.137.04-.256-.02-.36-.06-.103-.523-1.26-.717-1.725-.19-.456-.382-.394-.523-.4-.134-.007-.288-.007-.442-.007-.154 0-.404.058-.615.29-.21.232-.804.786-.804 1.918 0 1.132.823 2.225.94 2.38.116.154 1.61 2.46 3.902 3.375.545.217.97.347 1.302.445.55.162 1.05.14 1.446.085.44-.062 1.36-.556 1.55-1.092.19-.536.19-.996.133-1.092-.058-.096-.213-.154-.456-.276z" />
    </svg>
  );

  return (
    <button
      onClick={handleClick}
      style={styles.floatingButton}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      aria-label="Chat with us on WhatsApp"
    >
      {whatsappIcon}
    </button>
  );
};

export default WhatsApp;
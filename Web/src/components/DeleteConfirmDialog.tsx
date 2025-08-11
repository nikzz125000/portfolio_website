import React from 'react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  isDeleting,
  title = 'Delete Item?',
  message = 'This action cannot be undone. Do you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const getConfirmButtonStyle = () => {
    const baseStyle = {
      border: 'none',
      padding: '8px 12px',
      borderRadius: 4,
      cursor: isDeleting ? 'not-allowed' : 'pointer',
      opacity: isDeleting ? 0.7 : 1,
      color: 'white'
    };

    if (variant === 'danger') {
      return { ...baseStyle, backgroundColor: '#f44336' };
    } else {
      return { ...baseStyle, backgroundColor: '#ff9800' };
    }
  };

  const handleBackdropClick = () => {
    if (!isDeleting) {
      onCancel();
    }
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: 8,
          padding: 20,
          width: 340,
          maxWidth: '90vw',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
        onClick={handleDialogClick}
      >
        <div style={{ 
          fontSize: 16, 
          fontWeight: 600, 
          marginBottom: 10,
          color: variant === 'danger' ? '#f44336' : '#ff9800'
        }}>
          {title}
        </div>
        <div style={{ 
          fontSize: 13, 
          color: '#555', 
          marginBottom: 16,
          lineHeight: 1.4
        }}>
          {message}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 8 
        }}>
          <button
            style={{ 
              backgroundColor: '#e0e0e0', 
              color: '#333', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: 4, 
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.7 : 1
            }}
            onClick={onCancel}
            disabled={isDeleting}
          >
            {cancelText}
          </button>
          <button
            style={getConfirmButtonStyle()}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
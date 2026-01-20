import React from 'react';

export interface ButtonProps {
  /** Button label */
  label: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#333',
    border: '1px solid #ccc',
  },
  danger: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
  },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  small: { padding: '4px 8px', fontSize: '12px' },
  medium: { padding: '8px 16px', fontSize: '14px' },
  large: { padding: '12px 24px', fontSize: '16px' },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
};

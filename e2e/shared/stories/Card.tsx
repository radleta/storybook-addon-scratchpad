import React from 'react';

export interface CardProps {
  /** Card title */
  title: string;
  /** Card content */
  children: React.ReactNode;
  /** Card variant */
  variant?: 'default' | 'outlined' | 'elevated';
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: '#f8f9fa',
    border: 'none',
    boxShadow: 'none',
  },
  outlined: {
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    boxShadow: 'none',
  },
  elevated: {
    backgroundColor: 'white',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
};

export const Card: React.FC<CardProps> = ({
  title,
  children,
  variant = 'default',
}) => {
  return (
    <div
      style={{
        ...variantStyles[variant],
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>{title}</h3>
      <div style={{ color: '#666', fontSize: '14px', lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
};

import React from "react";

interface Props {
  code: string;
}

const appUrl = process.env. NEXT_PUBLIC_APP_URL || "";

export const VerificationUserTemplate: React.FC<Props> = ({ code }) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <div style={{
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h1 style={{
        color: '#333333',
        fontSize: '24px',
        marginBottom: '20px'
      }}>
        Підтвердження реєстрації
      </h1>
      <p style={{
        color: '#666666',
        fontSize: '16px',
        marginBottom: '20px'
      }}>
        Ваш код підтвердження:
      </p>
      <h2 style={{
        color: '#007bff',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '30px'
      }}>
        {code}
      </h2>
      <a
        href={`${appUrl}/verify?code=${code}`}
        style={{
          display: 'inline-block',
          backgroundColor: '#007bff',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Підтвердити реєстрацію
      </a>
      <p style={{
        color: '#999999',
        fontSize: '14px',
        marginTop: '30px'
      }}>
        Якщо ви не реєструвалися на нашому сайті, просто проігноруйте цей лист.
      </p>
    </div>
  </div>
);

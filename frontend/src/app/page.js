"use client";

// pages/index.js
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!username || !password) {
      setErrorMessage('Bitte Benutzername und Passwort eingeben.');
      return;
    }

    if (isLogin) {
      // Skip backend for now and directly go to dashboard
      router.push('/dashboard'); // Redirect to the dashboard upon successful login
    } else {
      // Placeholder for registration logic
      alert('Registrierung erfolgreich!');
      setIsLogin(true); // Switch back to Login view
    }
  };

  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(to bottom, #74ebd5, #acb6e5)' }}>
        <form onSubmit={handleSubmit} style={{ padding: '2rem', borderRadius: '8px', background: '#ffffff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333', fontWeight: '600' }}>{isLogin ? 'Login' : 'Registrieren'}</h1>
          {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '.5rem', color: '#555' }}>Benutzername</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '.5rem', borderRadius: '4px', border: '1px solid #ccc', color: '#333' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '.5rem', color: '#555' }}>Passwort</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '.5rem', borderRadius: '4px', border: '1px solid #ccc', color: '#333' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '.75rem', borderRadius: '4px', border: 'none', background: '#4CAF50', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}>
            {isLogin ? 'Anmelden' : 'Registrieren'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#555' }}>
            {isLogin ? 'Noch kein Konto? ' : 'Bereits ein Konto? '}
            <span
                onClick={() => setIsLogin(!isLogin)}
                style={{ color: '#4CAF50', cursor: 'pointer', textDecoration: 'underline' }}
            >
                        {isLogin ? 'Registrieren' : 'Login'}
                    </span>
          </p>
        </form>
      </div>
  );
};

export default LoginPage;

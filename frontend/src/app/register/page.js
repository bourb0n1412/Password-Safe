'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/register', { username, password });
      if (response.status === 200) {
        router.push('/'); // Nach erfolgreicher Registrierung zur Login-Seite navigieren
      }
    } catch (err) {
      setError('Registrierung fehlgeschlagen.');
    }
  };

  return (
    <div>
      <h1>Registrieren</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registrieren</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

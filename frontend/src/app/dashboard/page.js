'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login'); // Weiterleitung zur Login-Seite
      return;
    }

    fetchEntries(token);
  }, []);

  const fetchEntries = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/entries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        setError('Fehler beim Abrufen der Einträge.');
      }
    } catch (err) {
      console.error('Netzwerkfehler:', err);
      setError('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/entries/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
      } else {
        setError('Fehler beim Löschen des Eintrags.');
      }
    } catch (err) {
      console.error('Netzwerkfehler:', err);
      setError('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
    }
  };

  const handleCopyPassword = (password) => {
    if (password === "Fehler beim Entschlüsseln") {
      alert("Das Passwort konnte nicht entschlüsselt werden.");
      return;
    }
  
    navigator.clipboard.writeText(password).then(
      () => alert("Passwort kopiert!"),
      (err) => alert("Fehler beim Kopieren des Passworts.")
    );
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold">Lädt...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={() => router.push('/entries/create')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Neuer Eintrag
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex justify-between items-center border border-gray-300 rounded p-4 shadow-sm"
          >
            <div>
              <strong className="block text-lg font-semibold">{entry.category}</strong>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {entry.url}
              </a>
              <p className="text-sm text-gray-600">Benutzername: {entry.username}</p>
              <p className="text-sm text-gray-600">Notizen: {entry.notes || 'Keine Notizen'}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleCopyPassword(entry.encryptedPassword)}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Passwort kopieren
              </button>
              <button
                onClick={() => router.push(`/entries/${entry.id}`)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Bearbeiten
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Löschen
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

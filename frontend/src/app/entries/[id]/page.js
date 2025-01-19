'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditEntryPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    category: '',
    url: '',
    username: '',
    encryptedPassword: '',
    email: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Weiterleitung zur Login-Seite, wenn kein Token vorhanden ist
      return;
    }
    fetchEntry(token);
  }, []);

  const fetchEntry = async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/entries/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Token anhängen
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setLoading(false); // Laden abgeschlossen
      } else if (response.status === 401) {
        localStorage.removeItem('token'); // Token entfernen
        router.push('/login'); // Weiterleitung zur Login-Seite
      } else {
        setError('Fehler beim Laden des Eintrags.');
      }
    } catch (err) {
      console.error('Netzwerkfehler:', err);
      setError('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Weiterleitung zur Login-Seite, wenn kein Token vorhanden ist
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Token anhängen
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard'); // Zurück zum Dashboard
      } else {
        const errorMessage = await response.text();
        setError(`Fehler beim Aktualisieren: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Netzwerkfehler:', err);
      setError('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Lade Daten...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Eintrag bearbeiten</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Kategorie
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              URL
            </label>
            <input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Benutzername
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="encryptedPassword" className="block text-sm font-medium text-gray-700">
              Passwort
            </label>
            <input
              id="encryptedPassword"
              name="encryptedPassword"
              type="password"
              value={formData.encryptedPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notizen
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
          >
            Speichern
          </button>
        </form>
      </div>
    </div>
  );
}

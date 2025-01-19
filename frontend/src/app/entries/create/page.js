'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEntryPage() {
  const [formData, setFormData] = useState({
    category: '',
    url: '',
    username: '',
    encryptedPassword: '',
    email: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Zustand für Ladeanzeige
  const [passwordStrength, setPasswordStrength] = useState(''); // Passwortstärke
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'encryptedPassword') {
      validatePasswordStrength(value); // Passwortstärke prüfen
    }
  };

  const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      setPasswordStrength('Stark');
    } else if (password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber) {
      setPasswordStrength('Mittel');
    } else {
      setPasswordStrength('Schwach');
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setFormData((prev) => ({ ...prev, encryptedPassword: password }));
    validatePasswordStrength(password); // Generiertes Passwort prüfen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token'); // Token abrufen
    if (!token) {
      setError('Du bist nicht angemeldet. Bitte melde dich an.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Token hinzufügen
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard'); // Nach erfolgreicher Erstellung zurück zum Dashboard
      } else {
        const errorMessage = await response.text();
        console.error('Fehler beim Erstellen des Eintrags:', errorMessage);
        setError(`Fehler: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Netzwerkfehler:', err);
      setError('Netzwerkfehler. Bitte überprüfe deine Verbindung.');
    } finally {
      setLoading(false); // Ladeanzeige deaktivieren
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Neuen Eintrag erstellen</h1>
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
              onChange={(e) => {
                handleChange(e);
                if (!validatePasswordStrength(e.target.value)) {
                  setError(
                    'Passwort muss mindestens 8 Zeichen, eine Zahl, ein Sonderzeichen und Groß- sowie Kleinbuchstaben enthalten.'
                  );
                } else {
                  setError('');
                }
              }}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p
              className={`text-sm mt-1 ${
                passwordStrength === 'Stark'
                  ? 'text-green-500'
                  : passwordStrength === 'Mittel'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              Passwortstärke: {passwordStrength}
            </p>
            <button
              type="button"
              onClick={generatePassword}
              className="mt-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Starkes Passwort generieren
            </button>
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
          {loading && <p className="text-blue-500 text-sm mb-4">Wird erstellt...</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
            disabled={loading} // Button während des Ladens deaktivieren
          >
            {loading ? 'Erstellen...' : 'Erstellen'}
          </button>
        </form>
      </div>
    </div>
  );
}

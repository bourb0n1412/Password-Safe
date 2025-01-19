'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showStrength, setShowStrength] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      evaluatePasswordStrength(value);
      updatePasswordCriteria(value);
    }
  };

  const updatePasswordCriteria = (password) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const evaluatePasswordStrength = (password) => {
    const criteria = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];

    const metCriteria = criteria.filter(Boolean).length;

    if (metCriteria === 5) setPasswordStrength('Sehr Stark');
    else if (metCriteria >= 3) setPasswordStrength('Stark');
    else if (metCriteria >= 2) setPasswordStrength('Mittel');
    else setPasswordStrength('Schwach');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordStrength !== 'Sehr Stark') {
      setError('Das Passwort muss sehr stark sein.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Registrierung erfolgreich! Weiterleitung zur Anmeldung...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        const message = await response.text();
        setError(message || 'Fehler bei der Registrierung. Bitte versuchen Sie es erneut.');
      }
    } catch (err) {
      setError('Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Registrieren</h1>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                setShowStrength(true);
              }}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <ul className="text-sm text-gray-600 mt-2">
              <li className={passwordCriteria.length ? 'text-green-500' : ''}>
                Mindestens 8 Zeichen
              </li>
              <li className={passwordCriteria.uppercase ? 'text-green-500' : ''}>
                Mindestens ein Großbuchstabe
              </li>
              <li className={passwordCriteria.lowercase ? 'text-green-500' : ''}>
                Mindestens ein Kleinbuchstabe
              </li>
              <li className={passwordCriteria.number ? 'text-green-500' : ''}>
                Mindestens eine Zahl
              </li>
              <li className={passwordCriteria.specialChar ? 'text-green-500' : ''}>
                Mindestens ein Sonderzeichen
              </li>
            </ul>
            {showStrength && (
              <p
                className={`text-sm mt-2 ${
                  passwordStrength === 'Sehr Stark'
                    ? 'text-green-500'
                    : passwordStrength === 'Stark'
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}
              >
                Passwortstärke: {passwordStrength || 'Unbekannt'}
              </p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
          >
            Registrieren
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Bereits einen Account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Anmelden
          </a>
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function PasswordForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || { url: '', username: '', encryptedPassword: '', notes: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ url: '', username: '', encryptedPassword: '', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="url"
        placeholder="URL"
        value={formData.url}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Benutzername"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="encryptedPassword"
        placeholder="Passwort"
        value={formData.encryptedPassword}
        onChange={handleChange}
        required
      />
      <textarea
        name="notes"
        placeholder="Notizen"
        value={formData.notes}
        onChange={handleChange}
      />
      <button type="submit">{initialData ? 'Aktualisieren' : 'Hinzufügen'}</button>
    </form>
  );
}

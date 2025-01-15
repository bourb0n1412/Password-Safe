'use client';

import { useEffect, useState } from 'react';
import PasswordList from '../../components/PasswordList';
import PasswordForm from '../../components/PasswordForm';
import api from '../../utils/api';


export default function DashboardPage() {
  const [passwords, setPasswords] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);

  const fetchPasswords = async () => {
    try {
      const userId = 1; // Beispiel-ID
      const response = await api.get(`/entries/user`, { params: { userId } });
      console.log('Passwörter:', response.data); // Debugging
      setPasswords(response.data); // Daten setzen
    } catch (err) {
      console.error('Fehler beim Abrufen der Einträge:', err);
    }
  };
  

  useEffect(() => {
    fetchPasswords();
  }, []);

  const handleAddOrUpdate = async (entry) => {
    try {
      if (editingEntry) {
        await api.put(`/entries/${editingEntry.id}`, entry, {
          params: { userId: 1 },
        });
      } else {
        await api.post('/entries', entry, { params: { userId: 1 } });
      }
      setEditingEntry(null);
      fetchPasswords();
    } catch (err) {
      console.error('Fehler beim Hinzufügen/Aktualisieren:', err);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/entries/${id}`, {
        params: { userId: 1 },
      });
      fetchPasswords();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <PasswordForm onSubmit={handleAddOrUpdate} initialData={editingEntry} />
      <PasswordList passwords={passwords} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

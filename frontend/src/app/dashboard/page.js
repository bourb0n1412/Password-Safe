'use client';

import React, { useState } from 'react';

const Dashboard = () => {
    const [entries, setEntries] = useState([
        { id: 1, category: 'Privates', site: 'Google', username: 'admin', email: 'admin@gmail.com', notes: 'Persönlich' },
        { id: 2, category: 'Geschäft', site: 'GitHub', username: 'devuser', email: 'dev@company.com', notes: 'Arbeit' }
    ]);
    const [newEntry, setNewEntry] = useState({ site: '', username: '', email: '', notes: '', category: '' });
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleAddEntry = (e) => {
        e.preventDefault();
        const newId = entries.length ? entries[entries.length - 1].id + 1 : 1;
        setEntries([...entries, { id: newId, ...newEntry }]);
        setNewEntry({ site: '', username: '', email: '', notes: '', category: '' });
        setIsFormVisible(false);
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', background: '#f7f9fc', minHeight: '100vh', padding: '2rem', color: '#000' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Dashboard</h1>

            <button
                onClick={() => setIsFormVisible(true)}
                style={{
                    display: 'block',
                    margin: '0 auto 2rem',
                    padding: '0.75rem 1.5rem',
                    background: '#4CAF50',
                    color: '#fff',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Add Entry
            </button>

            {isFormVisible && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <form
                        onSubmit={handleAddEntry}
                        style={{
                            background: '#fff',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            width: '90%',
                            maxWidth: '400px',
                            display: 'grid',
                            gap: '1rem'
                        }}
                    >
                        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#000' }}>Add New Entry</h2>
                        <input
                            placeholder="Site"
                            value={newEntry.site}
                            onChange={(e) => setNewEntry({ ...newEntry, site: e.target.value })}
                            style={{ padding: '.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <input
                            placeholder="Username"
                            value={newEntry.username}
                            onChange={(e) => setNewEntry({ ...newEntry, username: e.target.value })}
                            style={{ padding: '.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <input
                            placeholder="E-Mail"
                            value={newEntry.email}
                            onChange={(e) => setNewEntry({ ...newEntry, email: e.target.value })}
                            style={{ padding: '.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <input
                            placeholder="Notes"
                            value={newEntry.notes}
                            onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                            style={{ padding: '.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <input
                            placeholder="Category"
                            value={newEntry.category}
                            onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                            style={{ padding: '.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                type="button"
                                onClick={() => setIsFormVisible(false)}
                                style={{
                                    padding: '.75rem',
                                    background: '#f44336',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    padding: '.75rem',
                                    background: '#4CAF50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <h2 style={{ textAlign: 'center', color: '#000', marginBottom: '1rem' }}>Saved Entries</h2>
            <ul
                style={{
                    listStyleType: 'none',
                    padding: 0,
                    maxWidth: '600px',
                    margin: '0 auto',
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
            >
                {entries.map((entry) => (
                    <li
                        key={entry.id}
                        style={{
                            padding: '1rem',
                            borderBottom: '1px solid #ccc',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '.5rem'
                        }}
                    >
                        <strong style={{ color: '#4CAF50' }}>{entry.category}</strong>
                        <span>
                            <strong>Site:</strong> {entry.site}
                        </span>
                        <span>
                            <strong>Username:</strong> {entry.username}
                        </span>
                        <span>
                            <strong>Email:</strong> {entry.email}
                        </span>
                        <span>
                            <strong>Notes:</strong> {entry.notes}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;

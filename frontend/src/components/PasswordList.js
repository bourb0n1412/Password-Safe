export default function PasswordList({ passwords, onEdit, onDelete }) {
    return (
      <div>
        <h2>Gespeicherte Passwörter</h2>
        <ul>
          {passwords.map((entry) => (
            <li key={entry.id}>
              <p>URL: {entry.url}</p>
              <p>Benutzername: {entry.username}</p>
              <p>Passwort: {entry.encryptedPassword}</p>
              <button onClick={() => onEdit(entry)}>Bearbeiten</button>
              <button onClick={() => onDelete(entry.id)}>Löschen</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
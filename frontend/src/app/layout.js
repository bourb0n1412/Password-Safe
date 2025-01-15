import '../styles/globals.css';

export const metadata = {
  title: 'Password Safe',
  description: 'Ein sicherer Passwort-Manager',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

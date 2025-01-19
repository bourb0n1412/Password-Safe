import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login'); // Weiterleitung zur Login-Seite
  return null;
}

// This file enables the /admin route to work as an entry point and redirects to the admin dashboard or login as appropriate.
import { redirect } from 'next/navigation';

export default function AdminEntryPage() {
  // You can add logic here if you want a custom landing for /admin, or just redirect to dashboard
  redirect('/admin/dashboard');
  return null;
}

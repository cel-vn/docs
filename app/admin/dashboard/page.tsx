imporexport default async function AdminDashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/dashboard');
  }

  const user = verifyToken(token);es } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminDashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/dashboard');
  }

  const user = verifyToken(token);
  
  if (!user) {
    redirect('/login?redirect=/admin/dashboard');
  }

  return <AdminDashboard user={user} />;
}

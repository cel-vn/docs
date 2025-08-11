import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import DatabaseViewer from '@/components/DatabaseViewer';

export default async function DatabasePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/database');
  }

  const user = verifyToken(token);
  
  if (!user || user.role !== 'admin') {
    redirect('/login?redirect=/admin/database');
  }

  return <DatabaseViewer />;
}

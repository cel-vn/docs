import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutConfirmation from '@/components/LogoutConfirmation';

export default async function LogoutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  // If not logged in, redirect to home
  if (!token) {
    redirect('/?message=not-logged-in');
  }

  return <LogoutConfirmation />;
}

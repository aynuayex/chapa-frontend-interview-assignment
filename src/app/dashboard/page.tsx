'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role === 'User') router.replace('/dashboard/user');
    else if (role === 'Admin') router.replace('/dashboard/admin');
    else if (role === 'Super Admin') router.replace('/dashboard/super');
    else router.replace('/');
  }, [role]);

  return <div className="w-full h-screen flex justify-center items-center p-4 text-center">Redirecting...</div>;
}

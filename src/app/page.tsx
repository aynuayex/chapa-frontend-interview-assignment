'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAuth();

  const handleLogin = (role: 'User' | 'Admin' | 'Super Admin') => {
    setRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-semibold">Login as:</h1>
      <div className="space-x-4">
        {/* <button onClick={() => handleLogin('User')}>User</button>
        <button onClick={() => handleLogin('Admin')}>Admin</button>
        <button onClick={() => handleLogin('Super Admin')}>Super Admin</button> */}
        <Button className='cursor-pointer' onClick={() => handleLogin('User')}>User</Button>
        <Button className='cursor-pointer' onClick={() => handleLogin('Admin')}>Admin</Button>
        <Button className='cursor-pointer' onClick={() => handleLogin('Super Admin')}>Super Admin</Button>
      </div>
    </div>
  );
}

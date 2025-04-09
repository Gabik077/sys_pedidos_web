// utils/withAuth.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function withAuth(Component: React.FC, allowedRoles: string[]) {
  return function AuthWrapper(props: any) {
    const router = useRouter();

    useEffect(() => {
      const checkCreds = async () => {
        const response = await fetch('/api/me', { credentials: 'include' });

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const res = await response.json();
        if (!allowedRoles.includes(res.user?.role)) {
          alert('No tienes permiso para acceder a esta página');
          router.push('/login');
        }
      };

      checkCreds();
    }, []);

    return <Component {...props} />;
  };
}

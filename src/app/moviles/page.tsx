// app/moviles/page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import MovilesTable from '../components/MovilesTable';

export default async function MovilesPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'ADMINISTRADOR' && decoded.role !== 'SYSADMIN') {
      redirect('/');
    }



    return <MovilesTable  />;
  } catch (err) {
    redirect('/login');
  }
}
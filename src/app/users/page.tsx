// app/users/page.tsx (SSR)
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import UsersTable from '../components/UsersTable';
import { fetchUsers } from '../services/userService';


export default async function UsersPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'ADMINISTRADOR') {
      redirect('/');
    }

    const users = await fetchUsers(token);

    return <UsersTable users={users} />;
  } catch (err) {
    redirect('/login');
  }
}

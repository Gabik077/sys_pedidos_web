// app/users/page.tsx (SSR)
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import {  fetchClientsFromServer } from '../services/clientService';
import ClientesTable from '../components/ClientTable';


export default async function ClientPage() {
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

    const clients = await fetchClientsFromServer(token);

    return <ClientesTable clientes={clients} />;
  } catch (err) {
    redirect('/login');
  }
}

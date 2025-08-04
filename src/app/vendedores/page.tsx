// app/vendedores/page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import VendedoresTable from '../components/VendedoresTable';
import { fetchVendedores } from '../services/vendedorService';

export default async function VendedoresPage() {
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

    const vendedores = await fetchVendedores(token);

    return <VendedoresTable vendedores={vendedores.data || []} />;
  } catch (err) {
    console.error("Error al verificar el token o cargar los vendedores:", err);
    redirect('/login');
  }
}

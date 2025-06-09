// app/products/page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import ProductsTable from '../components/ProductsTable';

export default async function ProductsPage() {
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: {
        Cookie: `token=${token}`
      },
      cache: 'no-store'
    });

    const products = await res.json();

    return <ProductsTable products={products} />;
  } catch (err) {
    redirect('/login');
  }
}

// app/products/page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import ProductsTable from '../components/ProductsTable';
import { fetchProducts } from '../services/productService';

export default async function ProductsPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'ADMINISTRADOR' && decoded.role !== 'VENDEDOR') {
      // Redirige si el rol no es ADMINISTRADOR o VENDEDOR
      redirect('/');
    }

    const products = await fetchProducts(token);


    return <ProductsTable products={products} />;
  } catch (err) {
    redirect('/login');
  }
}

import { productStatus } from '../../../../src/interfaces';
import { Product } from '../../../../src/products/entities/product.entity';

// Paso 1
// Esto es la simulacion de la Data de la base de datos
export const productStub = (): Product => {
  return {
    id: 4,
    name: 'producto2',
    sku: 'sku00001',
    description: 'descripcion del producto 2 con mayusculas',
    price: 12.12,
    status: productStatus.IN_STOCK,
    stock: 20,
    isActive: true,
    images_urls: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAVh-i7Htme9-DNjF4rIwgzZoHYXOWYXsWRR-Gjoi3scGC-FmB5TZFn0U9d8aD1Np936I&usqp=CAU',
      'https://www.oreo-la.com/images/release/products/Jea7pHdCXozWtQlRyLtADuo565rb9m11037SZMLK.png?v=ok',
    ],
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  };
};

export const stringProductStub = (): string => {
  return 'Product deleted';
};

import { Category } from '../../../../src/categories/entities/category.entity';

// Paso 1
// Esto es la simulacion de la Data de la base de datos
export const categoryStub = (): Category => {
  return {
    id: 3,
    name: 'ropa para damas',
    description: 'descripcion del producto 3 actualizado',
    isActive: true,
    store_id: 1,
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  };
};

export const stringCategoryStub = (): string => {
  return 'Category with ID deleted';
};

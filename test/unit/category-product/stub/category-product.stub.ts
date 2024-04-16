import { CategoryProduct } from '../../../../src/category-product/entities/category-product.entity';
// Paso 1
// Esto es la simulacion de la Data de la base de datos

export const categoryProductStub = (): CategoryProduct => {
  return {
    categoryId: 1,
    productId: 1,
    id: 1,
  };
};

export const allCategoriesProducts = () => {
  return [
    {
      categoryId: 1,
      categoryName: "women's clothes",
      products: [
        {
          id: 1,
          name: 'shirt',
          description: 'white shirt for men',
          isActive: true,
          stock: 50,
          price: 12,
          sku: 'ELP-001-GRY',
          status: 'in_stock',
          images_urls: ['https://encrypted-tbn0.gstatic.com/images'],
          created_at: '2024-04-01T13:22:52.869',
          updated_at: '2024-04-01T13:22:52.869',
        },
      ],
    },
  ];
};

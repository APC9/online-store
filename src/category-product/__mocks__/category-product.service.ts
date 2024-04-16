import { productStub } from '../../../test/unit/products/stub/product.stub';
import {
  allCategoriesProducts,
  categoryProductStub,
} from '../../../test/unit/category-product/stub/category-product.stub';

export const CategoryProductService = jest.fn().mockReturnValue({
  assingCategoryToProduct: jest.fn().mockReturnValue(categoryProductStub()),
  updateProductCategory: jest.fn().mockReturnValue(expect.any(String)),
  removeProductFromCategory: jest.fn().mockReturnValue(expect.any(String)),
  findAllCategoriesWithAllProducts: jest
    .fn()
    .mockReturnValue(allCategoriesProducts()),
  findAllProductsByCategoryName: jest.fn().mockReturnValue([productStub()]),
  findAllProductsByCategoryId: jest.fn().mockReturnValue([productStub()]),
});

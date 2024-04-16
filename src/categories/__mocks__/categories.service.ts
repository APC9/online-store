import {
  categoryStub,
  stringCategoryStub,
} from '../../../test/unit/categories/stub/category.stub';
// Paso 4: Hecer el mock de productService para evitar que el servicio real llame a la BBDD
export const CategoriesService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(categoryStub()),
  findOne: jest.fn().mockReturnValue(categoryStub()),
  findAll: jest.fn().mockReturnValue([categoryStub()]),
  findByTerm: jest.fn().mockReturnValue([categoryStub()]),
  update: jest.fn().mockReturnValue(categoryStub()),
  remove: jest.fn().mockReturnValue(stringCategoryStub()),
});

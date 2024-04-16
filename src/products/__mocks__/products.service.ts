import {
  productStub,
  stringProductStub,
} from '../../../test/unit/products/stub/product.stub';

// Paso 4: Hecer el mock de productService para evitar que el servicio real llame a la BBDD
export const ProductsService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(productStub()),
  findOne: jest.fn().mockReturnValue(productStub()),
  findAll: jest.fn().mockReturnValue([productStub()]),
  findByTerm: jest.fn().mockReturnValue([productStub()]),
  update: jest.fn().mockReturnValue(productStub()),
  remove: jest.fn().mockReturnValue(stringProductStub()),
});

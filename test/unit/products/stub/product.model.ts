import { MockModel } from '../../database/mock.model';
import { Product } from '../../../../src/products/entities/product.entity';
import { productStub } from './product.stub';

// paso 3 exterder el model del mockmodel
export class ProductModel extends MockModel<Product> {
  protected entityStub: Product = productStub();
}

//paso 4 ir a la carpeta __mocks__ en src/product

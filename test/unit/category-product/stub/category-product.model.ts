import { CategoryProduct } from '../../../../src/category-product/entities/category-product.entity';
import { MockModel } from '../../database/mock.model';
import { categoryProductStub } from './category-product.stub';

export class CategoryProductModel extends MockModel<CategoryProduct> {
  protected entityStub: CategoryProduct = categoryProductStub();
}

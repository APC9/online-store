import { MockModel } from '../../database/mock.model';
import { Category } from '../../../../src/categories/entities/category.entity';
import { categoryStub } from './category.stub';

// paso 3 exterder el model del mockmodel
export class CategoryModel extends MockModel<Category> {
  protected entityStub: Category = categoryStub();
}

//paso 4 ir a la carpeta __mocks__ en src/product

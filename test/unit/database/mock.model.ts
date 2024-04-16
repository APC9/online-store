// paso 2
// Simulacion de los metodos usados en los servicios
export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructorSpy(_createEntityData: T): void {}

  async create(): Promise<T> {
    return this.entityStub;
  }

  async findAll(): Promise<T[]> {
    return [this.entityStub];
  }

  async findOne(): Promise<T> {
    return this.entityStub;
  }

  async findByTerm(): Promise<T[]> {
    return [this.entityStub];
  }

  async update(): Promise<T> {
    return this.entityStub;
  }

  async remove(): Promise<T> {
    return this.entityStub;
  }

  async assingCategoryToProduct(): Promise<T> {
    return this.entityStub;
  }
}

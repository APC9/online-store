import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { User } from '@src/auth/entities/user.entity';
import { PaginationDto } from '@src/common';

@Injectable()
export class StoreService {
  private readonly logger = new Logger('StoreService');

  @InjectRepository(Store)
  private readonly storeRepository: Repository<Store>;

  async create(createStoreDto: CreateStoreDto, user: User) {
    try {
      const existStore = await this.findOneByNameStore(createStoreDto.name);

      if (existStore['stores']) {
        return new BadRequestException(
          `Store already exists with name:  ${createStoreDto.name}`,
        );
      }

      const store = this.storeRepository.create({
        ...createStoreDto,
        userId: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await this.storeRepository.save(store);
      return store;
    } catch (error) {
      Logger.error(error.message);

      if (error.message.includes('UQ_bff9b535dff86abbb2fe8779958'))
        return new BadRequestException(`Url slug duplicated`);

      return new InternalServerErrorException('Contact administrator');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const totalPages = await this.storeRepository.count({
      where: { isActive: true },
    });

    const lastPage = Math.ceil(totalPages / limit);
    const stores = await this.storeRepository.find({
      where: {
        isActive: true,
      },
    });

    return {
      data: stores,
      meta: {
        total: totalPages,
        offset,
        lastPage,
      },
    };
  }

  async findOneByNameStore(term: string) {
    try {
      const searchTerm = `%${term}%`;
      const queryBuilder = this.storeRepository.createQueryBuilder('store');
      const stores: Store[] = await queryBuilder
        .where('store.name ILIKE :searchTerm AND store.isActive = :isActive', {
          searchTerm,
          isActive: true,
        })
        .getMany();

      if (stores.length === 0) {
        return new NotFoundException(`Store by Term ${term} not found`);
      }

      return { stores };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact administrator');
    }
  }

  async findOneBySlugStore(term: string) {
    try {
      const queryBuilder = this.storeRepository.createQueryBuilder('store');
      const stores: Store[] = await queryBuilder
        .where('store.slug = :searchTerm AND store.isActive = :isActive', {
          searchTerm: term.toLocaleLowerCase(),
          isActive: true,
        })
        .getMany();

      if (stores.length === 0) {
        return new NotFoundException(`Store by Term ${term} not found`);
      }

      return { stores };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact administrator');
    }
  }

  async findOneByIdStore(id: number) {
    try {
      const stores = await this.storeRepository.findOneBy({
        id,
        isActive: true,
      });

      if (!stores) {
        return new NotFoundException(`Store by Term ${id} not found`);
      }

      return { stores };
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException('Contact administrator');
    }
  }

  async findStoresByUSerId(user: User) {
    const { id } = user;

    try {
      const stores = await this.storeRepository.find({
        where: {
          isActive: true,
          userId: id,
        },
      });

      if (stores.length === 0) {
        return new NotFoundException(`No found stores`);
      }

      return stores;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact administrator');
    }
  }

  async findOneStoreBySlugAndUSerId(term: string, user: User) {
    try {
      const stores = await this.queryFindOneStoreByIdAndUSerId(term, user);

      if (!stores) {
        return new NotFoundException(`Store by Term ${term} not found`);
      }

      return stores[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact administrator');
    }
  }

  async findOneStoreByIdAndUSerId(id: number, user: User) {
    try {
      const store = await this.storeRepository.find({
        where: {
          isActive: true,
          userId: user.id,
          id,
        },
      });

      if (store.length === 0) {
        return new NotFoundException(`Store by Term ${id} not found`);
      }

      return store[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact administrator');
    }
  }

  async update(term: string, updateStoreDto: UpdateStoreDto, user: User) {
    const { name, phone_number, description } = updateStoreDto;
    try {
      const store = await this.storeRepository.findOneBy({
        slug: term.toLowerCase(),
        isActive: true,
        userId: user.id,
      });

      if (!store) {
        return new NotFoundException(`Store by Term ${term} not found`);
      }

      const existStore = await this.findOneByNameStore(name);

      if (existStore['stores']) {
        return new BadRequestException(
          `Store already exists with name:  ${name}`,
        );
      }

      const updateName = name ? name.toLowerCase() : store.name;

      const updateDescription = description
        ? description.toLowerCase()
        : store.description;

      const updatePhoneNumber = phone_number
        ? phone_number
        : store.phone_number;

      const updateStore = {
        ...store,
        name: updateName,
        slug: updateName.replaceAll(' ', '_').replaceAll("'", ''),
        phone_number: updatePhoneNumber,
        description: updateDescription,
        updated_at: new Date(),
      };

      const storeSaved = await this.storeRepository.save(updateStore);

      return storeSaved;
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException('Contact administrator');
    }
  }

  async remove(id: number, user: User) {
    try {
      const store = await this.storeRepository.findOneBy({
        id,
        isActive: true,
        userId: user.id,
      });

      if (!store) {
        return new NotFoundException(`Store by Term ${id} not found`);
      }

      store.isActive = false;
      await this.storeRepository.save(store);

      return `${store.name} Delete successfully`;
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException('Contact administrator');
    }
  }

  private async queryFindOneStoreByIdAndUSerId(term: string, user: User) {
    const queryBuilder = this.storeRepository.createQueryBuilder('store');
    return await queryBuilder
      .where('store.slug = :term AND store.userId = :userId', {
        term: term.toLowerCase(),
        userId: user.id,
      })
      .getMany();
  }
}

import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: DataSourceOptions & { autoLoadEntities?: boolean } = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../../**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  autoLoadEntities: true,
};

const dataSource = new DataSource(typeOrmConfig);
export default dataSource;

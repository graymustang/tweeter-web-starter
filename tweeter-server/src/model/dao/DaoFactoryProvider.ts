import type { DaoFactory } from "./DaoFactory";
import { DynamoDBDaoFactory } from "./dynamo/DynamoDBDaoFactory";

const daoFactory: DaoFactory = new DynamoDBDaoFactory();
export const getDaoFactory = (): DaoFactory => daoFactory;

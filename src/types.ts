import {
  AbstractSqlConnection,
  AbstractSqlDriver,
  AbstractSqlPlatform,
  EntityManager,
} from "@mikro-orm/postgresql";
import { Request, Response } from "express";
import { Session } from "express-session";
import Redis from "ioredis";

export type MyContext = {
  em: EntityManager<
    AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>
  >;
  req: Request & {
    session: Session & { userId?: string };
  };
  res: Response;
  redis: Redis;
};

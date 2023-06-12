import {AbstractSqlConnection, AbstractSqlDriver, AbstractSqlPlatform, EntityManager} from "@mikro-orm/postgresql";

export type MyContext = {
    em:  EntityManager<AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>>;
}
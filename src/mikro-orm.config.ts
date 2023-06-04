import {Post} from "./entities/Post";
import {__prod__} from "./constants";
import {MikroORM} from "@mikro-orm/core";
import * as path from "path";

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}',
    },
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    dbName: 'myblog',
    type: 'postgresql',
    user: 'Chetanoo',
    password: 'ayudarme',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
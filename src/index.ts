import { MikroORM } from "@mikro-orm/core"
import {__prod__} from "./constants";
import {Post} from "./entities/Post";
import {v4 as uuid} from "uuid";
import mikroOrmConfig from "./mikro-orm.config";
import {EntityManager} from "@mikro-orm/postgresql";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/hello";

console.log('dirname', __dirname);

const main = async () => {
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false,
        }),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({app})

    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    });
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up()
    const em = orm.em as EntityManager;
    const fork = em.fork();
    // const post = fork.create(Post, {id: uuid(), title: 'my first post', createdAt: new Date(), updatedAt: new Date()});
    // await fork.persistAndFlush(post);
    // const posts = await fork.find(Post, {});
    // console.log(posts);
}

main().catch(err => {
    console.log(err)
});
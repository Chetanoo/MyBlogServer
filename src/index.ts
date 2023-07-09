import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
import { EntityManager } from "@mikro-orm/postgresql";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import RedisStore from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import { __prod__, COOKIE_NAME } from "./constants";
import { MyContext } from "./types";
import cors from "cors";
// import { sendEmail } from "./utils/sendEmail";

const main = async () => {
  const app = express();

  const corsOptions = {
    origin: ["http://localhost:4000", "http://localhost:3000"],
    credentials: true,
  };

  app.use(cors(corsOptions));

  // session middleware has to be run before apollo middleware
  // because apollo middleware will use session middleware
  // to get the session data

  // Initialize Redis client.
  const redis = new Redis();
  // redis.connect().catch(console.error);

  // Initialize Redis session store.
  const redisStore = new RedisStore({
    client: redis,
    prefix: "myblogapp:",
    disableTouch: true,
    // touch keeps the session alive and forces the session
    // cookie to be updated when the session is used
    // ttl: 86400, // 1 day
  });

  // Initialize session middleware.
  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: "fghfjhgjghjghj",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5, // 5 year
        httpOnly: true, // recommended: don't allow JS access to cookie
        sameSite: "lax", // recommended: protection against CSRF
        secure: __prod__, // recommended: only set cookie over https. In production this should be true.
        // secure: true, // recommended: only set cookie over https. In production this should be true.
      },
    })
  );

  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const em = orm.em as EntityManager;
  const fork = em.fork();
  // sendEmail("test@chet.com", "hello world");

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }): MyContext => ({
      em: fork,
      req,
      res,
      redis,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});

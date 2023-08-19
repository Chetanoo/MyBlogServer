import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import * as path from "path";
import { Like } from "./entities/Like";

const dataSource = new DataSource({
  type: "postgres",
  database: "myblog2",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [User, Post, Like],
  migrations: [path.join(__dirname, "./migrations/*")],
});

export default dataSource;

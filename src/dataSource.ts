import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import * as path from "path";

const dataSource = new DataSource({
  type: "postgres",
  database: "myblog2",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [User, Post],
  migrations: [path.join(__dirname, "./migrations/*")],
});

export default dataSource;

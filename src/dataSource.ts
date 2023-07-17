import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const dataSource = new DataSource({
  type: "postgres",
  database: "myblog2",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [User, Post],
});

export default dataSource;

import { CustomBaseEntity } from "./CustomBaseEntity";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { Post } from "./Post";
import { Like } from "./Like";

@ObjectType()
@Entity()
export class User extends CustomBaseEntity {
  @Field()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}

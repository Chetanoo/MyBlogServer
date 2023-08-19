import { CustomBaseEntity } from "./CustomBaseEntity";
import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Like } from "./Like";

@ObjectType()
@Entity()
export class Post extends CustomBaseEntity {
  @Field(() => String)
  @Column()
  title!: string;

  @Field(() => String)
  @Column()
  text!: string;

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
  rating!: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null; // 1 or -1 or null

  @Field(() => Int)
  @Column()
  creatorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
}

import { CustomBaseEntity } from "./CustomBaseEntity";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends CustomBaseEntity {
  @Field(() => String)
  @Column()
  title!: string;

  @Field(() => String)
  @Column()
  text!: string;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  rating!: number;

  @Field(() => Number)
  @Column()
  creatorId: number;

  @ManyToOne(() => User, (user) => user.posts)
  creator: User;
}

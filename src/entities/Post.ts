import { CustomBaseEntity } from "./CustomBaseEntity";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

@ObjectType()
@Entity()
export class Post extends CustomBaseEntity {
  @Field(() => String)
  @Column({ type: "text" })
  title!: string;
}

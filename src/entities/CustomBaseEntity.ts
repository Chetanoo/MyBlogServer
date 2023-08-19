import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
export abstract class CustomBaseEntity extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  // by comenting the @field we can choose what we
  // want to expose for graphql

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

import { v4 } from "uuid";
import { Property, PrimaryKey } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export abstract class CustomBaseEntity {
  @Field(() => String)
  @PrimaryKey()
  id: string = v4();

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  // by comenting the @field we can choose what we
  // want to expose for graphql

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

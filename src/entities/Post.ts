import { Entity, Property } from '@mikro-orm/core';
import {CustomBaseEntity} from "./CustomBaseEntity";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Post extends CustomBaseEntity {

    @Field(() => String)
    @Property({type: 'text'})
    title!: string
}
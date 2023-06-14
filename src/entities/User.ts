import { Entity, Property } from '@mikro-orm/core';
import {CustomBaseEntity} from "./CustomBaseEntity";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class User extends CustomBaseEntity {

    @Field()
    @Property({type: 'text', unique: true})
    username!: string

    @Property({type: 'text'})
    password!: string
}
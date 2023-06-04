import { Entity, Property } from '@mikro-orm/core';
import {CustomBaseEntity} from "./CustomBaseEntity";
@Entity()
export class Post extends CustomBaseEntity {

    @Property({type: 'text'})
    title!: string
}
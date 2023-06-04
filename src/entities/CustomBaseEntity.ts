// import { v4 } from "uuid";
import {Property, PrimaryKey} from "@mikro-orm/core";

export abstract class CustomBaseEntity {

    @PrimaryKey()
    id!: string;

    @Property({type: "date"})
    createdAt = new Date();

    @Property({ type: "date", onUpdate: () => new Date() })
    updatedAt = new Date();

}
import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {User} from "../entities/User";
import {MyContext} from "../types";
import argon2 from "argon2";
import {v4 as uuid} from "uuid";

@InputType()
class UsernamePasswordInput {
    @Field()
    username!: string
    @Field()
    password!: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'Length must be greater than 2'
                    }
                ]
            }
        }
        if (options.password.length <= 3) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Length must be greater than 3'
                    }
                ]
            }
        }
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(
            User,
            {
                id: uuid(),
                username: options.username,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        try {
            await em.persistAndFlush(user)
        } catch (e) {
            if (e.code === "23505") { // || e.detail.includes("already exists")) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'Username already taken'
                        }
                    ]
                }
            }
        }
        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        try {
            const user = await em.findOneOrFail(User, {username: options.username})
            const isValid = await argon2.verify(user.password, options.password)
            if (!isValid) {
                return {
                    errors: [
                        {
                            field: 'passowrd',
                            message: 'Incorrect password'
                        }
                    ]
                }
            }
            return {user};
        } catch (e) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'username does not exist'
                    }
                ]
            }
        }
    }
}
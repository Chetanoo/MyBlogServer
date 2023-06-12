import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Post} from "../entities/Post";
import {MyContext} from "../types";
import {v4 as uuid} from "uuid";
// import { wrap } from '@mikro-orm/core';

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
        @Ctx() {em}: MyContext
    ): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id') id: string,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, {id});
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post> {
        const post: Post = em.create(
            Post,
            {
                id: uuid(),
                title,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        )
        await em.persistAndFlush(post)
        return post;
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg('id') id: string,
        @Arg('title') title: string,
        // @Arg(
        //     'title',
        //     () => String,
        //     {nullable: true}
        // ) title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post> {
        // const post: Post = await em.findOneOrFail(
        //     Post,
        //     {id},
        //     {
        //         failHandler: (entityName: string) =>
        //             new Error(`Failed: ${entityName} not found`)
        //     });
        // wrap(post).assign({title, updatedAt: new Date()});
        const post = await em.findOne(Post, {id});
        if (!post) throw new Error('Post not found');
        if (title) {
            post!.title = title;
            post!.updatedAt = new Date();
        }
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post)
    async deletePost(
        @Arg('id') id: string,
        @Ctx() {em}: MyContext
    ): Promise<Post> {
        const post = await em.getReference(Post, id);
        if (!post) throw new Error('Post not found');
        await em.remove(post).flush();
        return em.findOneOrFail(Post, {id});
    }
}
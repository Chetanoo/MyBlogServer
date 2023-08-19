import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/Post";
import { Like } from "../entities/Like";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import dataSource from "../dataSource";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field(() => Boolean)
  hasMore: Boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext,
    @Arg("value", () => Int) value: number
  ) {
    const isLike = value !== -1;
    const _value = isLike ? 1 : -1;
    const { userId } = req.session;
    const like = await Like.findOne({
      where: { postId, userId: req.session.userId },
    });
    if (like && like.value !== _value) {
      // the user liked post before
      await dataSource.transaction(async (em) => {
        await em.query(
          `
          update "like"
          set value = $1
          where "postId" = $2 and "userId" = $3;
          `,
          [_value, postId, userId]
        );
        await em.query(
          `
          update post
          set rating = rating + $1
          where id = $2;
          `,
          [_value + _value, postId]
        );
      });
    } else if (!like) {
      // never voted before
      await dataSource.transaction(async (em) => {
        await em.query(
          `
          insert into "like" ("userId", "postId", value)
          values ($1, $2, $3);
          `,
          [userId, postId, _value]
        );
        await em.query(
          `
          update post
          set rating = rating + $1
          where id = $2;
          `,
          [_value, postId]
        );
      });
    }
    // await Like.insert({ userId, postId, value: _value });
    // await Post.update({ id: postId }, { rating: () => `rating + ${_value}` });
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [realLimitPlusOne];

    if (req.session.userId) {
      replacements.push(req.session.userId);
    }
    let cursorIdx = 3;
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
      cursorIdx = replacements.length;
    }
    const posts = await dataSource.query(
      `
        SELECT p.*,
        json_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email,
            'createdAt', u."createdAt",
            'updatedAt', u."updatedAt"
        ) creator,
        ${
          req.session.userId
            ? '(select value from "like" where "userId" = $2 and "postId" = p.id) "voteStatus"'
            : 'null as "voteStatus"'
        }
        from post p
        inner join public.user u on u.id = p."creatorId"
        ${cursor ? `where p."createdAt" < $${cursorIdx}` : ""}
        order by p."createdAt" DESC
        limit $1
    `,
      replacements
    );

    // const qb = await dataSource
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", "u.id = p.creatorId")
    //   .take(realLimitPlusOne)
    //   .orderBy("p.createdAt", "DESC");
    // if (cursor) {
    //   qb.where("p.createdAt < :cursor", { cursor: new Date(parseInt(cursor)) });
    // }
    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOneBy({ id });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Post | null> {
    const post = await Post.findOneBy({ id });
    if (!post) {
      return null;
    }
    if (typeof title !== undefined) {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<Boolean> {
    await Post.delete(id);
    return true;
  }
}

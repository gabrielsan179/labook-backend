import { likeDislikeDB } from './../types';
import { PostDB, PostWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public async findPostsWithCreator() {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.created_at",
                "posts.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
        return result
    }

    public async findPostById(id: string) {
        const [postDB]: PostDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id })

        return postDB
    }

    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async updatePost(idToEdit: string, newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(newPostDB)
            .where({ id: idToEdit })
    }

    public async deletePost(idToDelete: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .del()
            .where({ id: idToDelete })
    }
    public async findPostsWithCreatorById(postId: string) {
        const [result]: PostWithCreatorDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.created_at",
                "posts.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where( "posts.id", postId )
        return result
    }
    public async likeOrDislikePost(newlikeOrDislike: likeDislikeDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .insert(newlikeOrDislike)
    }
    public async findLikesDislikes(newlikeOrDislike: likeDislikeDB) {
        const [result]: likeDislikeDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .where({
                user_id: newlikeOrDislike.user_id,
                post_id: newlikeOrDislike.post_id
            })
        return result
    }
    public async deleteLikesDislikes(newlikeOrDislike: likeDislikeDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .del()
            .where({
                user_id: newlikeOrDislike.user_id,
                post_id: newlikeOrDislike.post_id
            })
    }
    public async updateLikesDislikes(newlikeOrDislike: likeDislikeDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update(newlikeOrDislike)
            .where({
                user_id: newlikeOrDislike.user_id,
                post_id: newlikeOrDislike.post_id
            })
    }
}
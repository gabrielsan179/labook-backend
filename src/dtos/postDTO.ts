import { PostModel } from "../types"

export interface GetPostsInput {
    token: string | undefined
}

export type GetPostsOutput = PostModel[]

export interface CreatePostInput {
    token: string | undefined,
    content: unknown
}

export interface EditPostInput {
    idToEdit: string,
    token: string | undefined,
    content: unknown
}

export interface DeletePostInput {
    idToDelete: string,
    token: string | undefined
}

export interface LikeOrDislikePostInput {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}

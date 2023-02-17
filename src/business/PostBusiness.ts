import { Post } from './../models/Post';
import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInput, DeletePostInput, EditPostInput, GetPostsInput, GetPostsOutput } from "../dtos/postDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { ForbiddenError } from "../errors/ForbiddenError"
import { NotFoundError } from "../errors/NotFoundError"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { USER_ROLES } from '../types';

export class PostBusiness {
    constructor (
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    public getPosts = async (input: GetPostsInput): Promise<GetPostsOutput> => {
        const { token } = input

        if(!token){
            throw new BadRequestError("Token não enviado");
        }

        const payload = this.tokenManager.getPayload(token as string)
       
        if(payload === null){
            throw new BadRequestError("Token inválido");
        }

        const postsWithCreatorDB = await this.postDatabase.findPostsWithCreator()

        const postsWithCreator = postsWithCreatorDB.map((postWithCreatorDB) => {
            const postWithCreator = new Post (
                postWithCreatorDB.id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.creator_name
            )
            return postWithCreator.toBusinessModel()
        })

        const output: GetPostsOutput = postsWithCreator

        return output
    }

    public createPost = async (input: CreatePostInput): Promise<void> => {
        const { token, content } = input

        if(!token){
            throw new BadRequestError("Token não enviado");
        }

        const payload = this.tokenManager.getPayload(token as string)
       
        if(payload === null){
            throw new BadRequestError("Token inválido");
        }

        if (!content) {
            throw new BadRequestError("'content' obrigatório para criar um post")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }
       
        const id = this.idGenerator.generate()

        const postDB = await this.postDatabase.findPostById(id)

        if (postDB) {
            throw new BadRequestError("erro ao gerar ID, execute o endpoint novamente")
        }

        const newPost = new Post (
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const newPostDB = newPost.toDBModel()

        await this.postDatabase.insertPost(newPostDB)
    }

    public editPost = async (input: EditPostInput): Promise<void> => {
        const { idToEdit, token, content } = input
        
        if(!token){
            throw new BadRequestError("Token não enviado");
        }
        
        const payload = this.tokenManager.getPayload(token as string)
        
        if(payload === null){
            throw new BadRequestError("Token inválido");
        }
        
        const postDB = await this.postDatabase.findPostById(idToEdit)

        if (!postDB) {
            throw new BadRequestError("id informada não encontrada")
        }

        if(payload.id !== postDB.creator_id) {
            throw new BadRequestError("apenar o criador do post pode editá-la")
        }

        if (!content) {
            throw new BadRequestError("'content' obrigatório para criar um post")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }
       
        const newPost = new Post (
            idToEdit,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            payload.id,
            payload.name
        )
        newPost.setContent(content)
        newPost.setUpdatedAt(new Date().toISOString())


        const newPostDB = newPost.toDBModel()

        await this.postDatabase.updatePost(idToEdit, newPostDB)
    }
    public deletePost = async (input: DeletePostInput): Promise<void> => {
        const { idToDelete, token } = input
        
        if(!token){
            throw new BadRequestError("Token não enviado");
        }
        
        const payload = this.tokenManager.getPayload(token as string)
        
        if(payload === null){
            throw new BadRequestError("Token inválido");
        }
        
        const postDB = await this.postDatabase.findPostById(idToDelete)

        if (!postDB) {
            throw new BadRequestError("id informada não encontrada")
        }

        if (payload.role !== USER_ROLES.ADMIN){
            await this.postDatabase.deletePost(idToDelete)
        }

        if(payload.role !== USER_ROLES.ADMIN && payload.id !== postDB.creator_id) {
            throw new BadRequestError("apenar o criador do post pode deletá-lo")
        }
            
        await this.postDatabase.deletePost(idToDelete)
    }
}
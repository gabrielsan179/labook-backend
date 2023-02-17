import { UserModel } from "../types"

export interface GetUsersInput {
    q: unknown,
    token: string | undefined
}

export type GetUsersOutput = UserModel[]

export interface SignupInput {
    name: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutput {
    token: string | undefined
}

export interface LoginInput {
    email: unknown,
    password: unknown
}

export interface LoginOutput {
    token: string | undefined
}
import { UserDatabase } from "../database/UserDatabase"
import { regexEmail, regexPassword, TokenPayload, USER_ROLES } from "../types"
import { User } from "../models/User"
import { GetUsersInput, GetUsersOutput, LoginInput, LoginOutput, SignupInput, SignupOutput } from "../dtos/UserDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { ForbiddenError } from "../errors/ForbiddenError"
import { NotFoundError } from "../errors/NotFoundError"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public getUsers = async (input: GetUsersInput): Promise<GetUsersOutput> => {
        const { q, token } = input

        if (!token) {
            throw new BadRequestError("Token não enviado");
        }

        const payload = this.tokenManager.getPayload(token as string)

        if (payload === null) {
            throw new BadRequestError("Token inválido");
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            throw new ForbiddenError()
        }

        console.table({ payload })


        if (typeof q !== "string" && q !== undefined) {
            throw new BadRequestError("'q' deve ser string ou undefined")
        }

        const usersDB = await this.userDatabase.findUsers(q)

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            )
            return user.toBusinessModel()
        })

        const output: GetUsersOutput = users

        return output
    }

    public signup = async (input: SignupInput): Promise<SignupOutput> => {
        const { name, email, password } = input

        if (!name) {
            throw new BadRequestError("'name' obrigatório para cadastro")
        }

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (!email) {
            throw new BadRequestError("'email' obrigatório para cadastro")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (!email.match(regexEmail)) {
            throw new BadRequestError("Formato de email invalido")
        }

        const userDB = await this.userDatabase.findUserByEmail(email)

        if (userDB) {
            throw new BadRequestError("já existe usuario com email informada")
        }

        if (!password) {
            throw new BadRequestError("'password' obrigatório para cadastro")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        if (!password.match(regexPassword)) {
            throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

        const hashedPassword = await this.hashManager.hash(password)

        const id = this.idGenerator.generate()

        const userId = await this.userDatabase.findUserById(id)

        if (userId) {
            throw new BadRequestError("erro ao gerar ID, execute o endpoint novamente")
        }

        const newUser = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )

        const newUserDB = newUser.toDBModel()

        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output: SignupOutput = {
            token
        }

        return output
    }

    public login = async (input: LoginInput): Promise<LoginOutput> => {
        const { email, password } = input

        if (!email) {
            throw new BadRequestError("'email' obrigatório para login")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (!password) {
            throw new BadRequestError("'password' obrigatório para login")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const userDB = await this.userDatabase.findUserByEmail(email)

        if (!userDB) {
            throw new NotFoundError("'email' não encontrado")
        }

        const isPasswordCorrect = await this.hashManager.compare(password, userDB.password)

        if (!isPasswordCorrect) {
            throw new BadRequestError("'password' incorreto");
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutput = {
            token
        }

        return output
    }
}
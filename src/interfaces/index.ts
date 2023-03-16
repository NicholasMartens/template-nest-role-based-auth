import { User } from 'src/api/users/users.entity'

export interface IAuthUser {
  user: User
  access_token: string
}

export interface User {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  birthDay?: string
  gender?: string
  dateCreated?: string
  id?: string
  username?: string
  token?: string
  avatar?: string
  backgroundImage?: string
  introduce?: string
  rePassword?: string
}

export interface MessageValidation {
  email?: string
  password?: string
  rePassword?: string
  firstName?: string
  lastName?: string
  birthDay?: string
}

export interface Router {
  path: string
  component: () => JSX.Element
}

export interface Post {
  content: string
  dateCreated: string
  accountId: string
  communityId: string
  id?: string
  images?: string
  video?: string
}

export interface User {
  id?: string
  username?: string
  email: string
  password: string
  firstName: string
  lastName: string
  birthDay: string
  gender: string
  dateCreated: string
  avatar?: string
  backgroundImage?: string
  slogan?: string
}

export interface MessageValidation {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  birthDay?: string
}

export interface Router {
  path: string
  component: () => JSX.Element
}

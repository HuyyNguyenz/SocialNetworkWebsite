export interface User {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  birthDay?: string
  gender?: string
  createdAt?: string
  id?: number
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

export interface Posts {
  content: string
  createdAt: string
  userId: number
  communityId: number
  type: string
  id?: number
  modifiedAt?: string
  images?: FilePreview[]
  video?: FilePreview
}

export interface FilePreview {
  id: string
  name: string
  src: string
  origin?: File
  url?: string
}

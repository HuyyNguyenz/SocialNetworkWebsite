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
  avatar?: { name: string; url: string }
  backgroundImage?: { name: string; url: string }
  verify?: string
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
  createdAt: string
  userId: number
  communityId: number
  type: string
  id?: number
  modifiedAt?: string
  images?: FilePreview[]
  video?: FilePreview
  deleted?: number
}

export interface Comment {
  content: string
  createdAt: string
  userId: number
  postId: number
  id?: number
  modifiedAt?: string
  images?: FilePreview[]
  video?: FilePreview
  deleted?: number
}

export interface FilePreview {
  id: string
  name: string
  src: string
  origin?: File
  url?: string
}

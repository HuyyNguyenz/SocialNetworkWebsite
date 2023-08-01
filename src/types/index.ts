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
  isOnline?: string
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

export interface ExtraPost {
  id?: number
  userId?: number
  postId?: number
  type?: string
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

export interface Message {
  content: string
  createdAt: string
  userId: number
  friendId: number
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

export interface Friend {
  id?: string
  status?: string
  friendId?: number
  userId?: number
}

export interface Notify {
  id?: string
  status?: string
  type?: string
  typeId?: number
  receiverId?: number
}

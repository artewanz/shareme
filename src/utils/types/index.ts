export interface IUser {
  _id: string
  _type: string
  userName: string
  image: string
  _createdAt?: string
  _updatedAt?: string
  _rev?: string
}

export interface IComment {
  postedBy: {
    image: string
    userName: string
  }
  comment: string
}

export interface IPin {
  _id: string
  title: string
  about: string
  destination: string
  image: { asset: { url: string } }
  postedBy: IUser
  save: IPin[] | null
  comments?: IComment[]
}

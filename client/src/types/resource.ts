import type { BaseEntity } from "./common"

export interface Resource extends BaseEntity {
  title: string
  description: string
  type: ResourceType
  category: string
  content: string
  author: Author
  tags: string[]
  readTime: number
  isPublished: boolean
  featuredImage?: string
  downloadUrl?: string
}

export interface Author {
  name: string
  role: string
  avatar?: string
  bio?: string
}

export enum ResourceType {
  DOCUMENTATION = "documentation",
  API_REFERENCE = "api-reference",
  CASE_STUDY = "case-study",
  HELP_ARTICLE = "help-article",
  TUTORIAL = "tutorial",
  WHITEPAPER = "whitepaper",
}

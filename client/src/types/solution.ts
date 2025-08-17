import type { BaseEntity } from "./common"

export interface Solution extends BaseEntity {
  title: string
  description: string
  industry: Industry
  useCases: UseCase[]
  benefits: string[]
  implementation: ImplementationStep[]
  caseStudies: CaseStudy[]
  isActive: boolean
  image: string
}

export interface Industry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
}

export interface UseCase {
  title: string
  description: string
  benefits: string[]
}

export interface ImplementationStep {
  step: number
  title: string
  description: string
  duration: string
}

export interface CaseStudy {
  company: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  image?: string
}

export type PresentationPdfOptions = {
  includeCover: boolean
  includeComparison: boolean
  includeOutcomes: boolean
  includeImages: boolean
  includeDiagrams: boolean
  includeBullets: boolean
  /** Empty = all sections */
  sectionIds: string[]
}

export function defaultPdfOptions(sectionIds: string[]): PresentationPdfOptions {
  return {
    includeCover: true,
    includeComparison: true,
    includeOutcomes: true,
    includeImages: true,
    includeDiagrams: true,
    includeBullets: true,
    sectionIds: [...sectionIds],
  }
}

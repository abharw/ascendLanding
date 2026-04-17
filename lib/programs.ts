export const PROGRAM_PRICES: Record<string, number> = {
  "ascendiq-bootcamp": 149_500,
  "startup-lab": 49_900,
  "skills-internships": 39_900,
  "career-training": 300_000,
  "ai-toolkit-adults": 39_900,
}

export const PROGRAM_NAMES: Record<string, string> = {
  "ascendiq-bootcamp": "Summer Startup Lab",
  "startup-lab": "Entrepreneurship Training",
  "skills-internships": "Apprenticeship Skill Building",
  "career-training": "Mentoring & Coaching",
  "ai-toolkit-adults": "AI Toolkit for Adults",
}

export const OPEN_PROGRAMS = [
  "ascendiq-bootcamp",
  "flex-bundle",
  "startup-lab",
  "skills-internships",
  "career-training",
  "ai-toolkit-adults",
  "cart",
]

export function computeAmount(
  programId: string,
  bundleSelections: string[],
  cartItems: string[],
): number | null {
  if (programId === "cart") {
    if (cartItems.length === 0) return null
    const total = cartItems.reduce((sum, id) => sum + (PROGRAM_PRICES[id] ?? 0), 0)
    return total > 0 ? total : null
  }
  if (programId === "flex-bundle") {
    if (bundleSelections.length < 2) return null
    return bundleSelections.reduce((sum, id) => sum + (PROGRAM_PRICES[id] ?? 0), 0)
  }
  return PROGRAM_PRICES[programId] ?? null
}

export function deriveProgramLabel(
  programId: string,
  bundleSelections: string[],
  cartItems: string[],
): { dbProgramId: string; dbProgramName: string } {
  if (programId === "cart") {
    return {
      dbProgramId: "cart:" + cartItems.join("+"),
      dbProgramName: cartItems.map((id) => PROGRAM_NAMES[id] ?? id).join(", "),
    }
  }
  if (programId === "flex-bundle") {
    return {
      dbProgramId: programId,
      dbProgramName: "Flex Bundle: " + bundleSelections.map((id) => PROGRAM_NAMES[id] ?? id).join(", "),
    }
  }
  return {
    dbProgramId: programId,
    dbProgramName: PROGRAM_NAMES[programId] ?? programId,
  }
}

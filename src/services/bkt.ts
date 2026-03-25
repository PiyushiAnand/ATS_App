import { KC } from "../types";

/**
 * Bayesian Knowledge Tracing (BKT) Update Logic
 * As described in the ET-605 Project Presentation
 */
export function updateMastery(
  currentPL: number,
  isCorrect: boolean,
  kc: KC
): number {
  const { pG, pS, pT } = kc;

  // 1. Response Update (Observed probability)
  let pObs: number;
  if (isCorrect) {
    pObs = (currentPL * (1 - pS)) / (currentPL * (1 - pS) + (1 - currentPL) * pG);
  } else {
    pObs = (currentPL * pS) / (currentPL * pS + (1 - currentPL) * (1 - pG));
  }

  // 2. Learning Transition
  const pNew = pObs + (1 - pObs) * pT;

  return Math.min(0.99, Math.max(0.01, pNew));
}

export const KNOWLEDGE_COMPONENTS: KC[] = [
  {
    id: 'KC1',
    title: 'Data Representation',
    description: 'Introductory data handling and bar graphs.',
    pL0: 0.35,
    pT: 0.20,
    pG: 0.25,
    pS: 0.10,
  },
  {
    id: 'KC2',
    title: 'Pie Charts',
    description: 'Understanding and interpreting pie charts.',
    pL0: 0.25,
    pT: 0.25,
    pG: 0.20,
    pS: 0.12,
  },
  {
    id: 'KC3',
    title: 'Basic Probability',
    description: 'Simple random experiments and probability.',
    pL0: 0.30,
    pT: 0.18,
    pG: 0.22,
    pS: 0.10,
  },
];

export const KC_LAST_ORDER: Record<string, number> = {
  KC1: 4,
  KC2: 3,
  KC3: 6,
};

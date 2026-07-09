import type { ResumeOutput } from './schemas';

/**
 * Honest ATS score computed from the generated resume JSON — replaces the old
 * hardcoded 92%. Weighting:
 *   - keyword match vs atsKeywords ....... 40 pts
 *   - quantified bullets ratio ........... 25 pts
 *   - action-verb bullet starts .......... 15 pts
 *   - section completeness ............... 10 pts
 *   - length sanity ...................... 10 pts
 */

export interface AtsCriterion {
  key: string;
  label: string;
  score: number;
  max: number;
  tip?: string; // only present when points were lost
}

export interface AtsScore {
  total: number; // 0-100
  criteria: AtsCriterion[];
}

const WEAK_STARTS = new Set([
  'responsible',
  'worked',
  'helped',
  'assisted',
  'involved',
  'tasked',
  'duties',
  'was',
  'were',
  'a',
  'an',
  'the',
]);

const QUANTIFIER = /(\d|%|\$|€|£|₹)/;

function allBullets(resume: ResumeOutput): string[] {
  return resume.experience.flatMap((e) => e.bullets).filter(Boolean);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text: string): number {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
}

export function computeAtsScore(resume: ResumeOutput): AtsScore {
  const criteria: AtsCriterion[] = [];
  const bullets = allBullets(resume);

  // --- Keyword match (40) -------------------------------------------------
  const keywords = resume.atsKeywords.map((k) => k.toLowerCase()).filter(Boolean);
  const bodyText = [
    resume.summary,
    ...bullets,
    ...resume.skills.technical,
    ...resume.skills.tools,
    ...resume.skills.soft,
    resume.header.title,
  ]
    .join(' ')
    .toLowerCase();

  let keywordScore = 0;
  let missingKeywords: string[] = [];
  if (keywords.length > 0) {
    const matched = keywords.filter((k) => bodyText.includes(k));
    missingKeywords = keywords.filter((k) => !bodyText.includes(k));
    keywordScore = Math.round((matched.length / keywords.length) * 40);
  }
  criteria.push({
    key: 'keywords',
    label: 'ATS keyword match',
    score: keywordScore,
    max: 40,
    tip:
      keywordScore < 40 && missingKeywords.length > 0
        ? `Missing keywords: ${missingKeywords.slice(0, 4).join(', ')} — work them into your summary or bullets.`
        : keywordScore < 40
        ? 'No target keywords were identified — regenerate with a clearer target job title.'
        : undefined,
  });

  // --- Quantified bullets (25) --------------------------------------------
  let quantScore = 0;
  let unquantified = 0;
  if (bullets.length > 0) {
    const quantified = bullets.filter((b) => QUANTIFIER.test(b)).length;
    unquantified = bullets.length - quantified;
    quantScore = Math.round((quantified / bullets.length) * 25);
  }
  criteria.push({
    key: 'quantified',
    label: 'Quantified achievements',
    score: quantScore,
    max: 25,
    tip:
      unquantified > 0
        ? `${unquantified} bullet${unquantified === 1 ? '' : 's'} lack numbers — add metrics (%, $, time saved, team size).`
        : bullets.length === 0
        ? 'No experience bullets found — add work experience.'
        : undefined,
  });

  // --- Action-verb starts (15) --------------------------------------------
  let verbScore = 0;
  let weakStarts = 0;
  if (bullets.length > 0) {
    const strong = bullets.filter((b) => {
      const first = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
      return first.length > 0 && !WEAK_STARTS.has(first);
    }).length;
    weakStarts = bullets.length - strong;
    verbScore = Math.round((strong / bullets.length) * 15);
  }
  criteria.push({
    key: 'verbs',
    label: 'Action-verb bullet starts',
    score: verbScore,
    max: 15,
    tip:
      weakStarts > 0
        ? `${weakStarts} bullet${weakStarts === 1 ? '' : 's'} start weakly ("responsible for", "worked on") — lead with verbs like Led, Built, Reduced.`
        : undefined,
  });

  // --- Section completeness (10) -------------------------------------------
  const sections: Array<[boolean, string]> = [
    [Boolean(resume.header.name && resume.header.email && resume.header.phone), 'contact info'],
    [Boolean(resume.summary), 'summary'],
    [resume.experience.length > 0, 'experience'],
    [resume.education.length > 0, 'education'],
    [
      resume.skills.technical.length + resume.skills.tools.length + resume.skills.soft.length > 0,
      'skills',
    ],
  ];
  const present = sections.filter(([ok]) => ok).length;
  const missingSections = sections.filter(([ok]) => !ok).map(([, name]) => name);
  const completenessScore = Math.round((present / sections.length) * 10);
  criteria.push({
    key: 'sections',
    label: 'Section completeness',
    score: completenessScore,
    max: 10,
    tip: missingSections.length > 0 ? `Missing section${missingSections.length === 1 ? '' : 's'}: ${missingSections.join(', ')}.` : undefined,
  });

  // --- Length sanity (10): bullets 8-20 words, summary <= 3 sentences ------
  let lengthScore = 10;
  const tips: string[] = [];
  if (bullets.length > 0) {
    const offLength = bullets.filter((b) => {
      const w = wordCount(b);
      return w < 8 || w > 20;
    }).length;
    const bulletPenalty = Math.round((offLength / bullets.length) * 7);
    if (bulletPenalty > 0) {
      lengthScore -= bulletPenalty;
      tips.push(`${offLength} bullet${offLength === 1 ? '' : 's'} outside the 8-20 word sweet spot.`);
    }
  } else {
    lengthScore -= 7;
  }
  if (sentenceCount(resume.summary) > 3) {
    lengthScore -= 3;
    tips.push('Summary runs past 3 sentences — tighten it.');
  }
  lengthScore = Math.max(0, lengthScore);
  criteria.push({
    key: 'length',
    label: 'Length & concision',
    score: lengthScore,
    max: 10,
    tip: tips.length > 0 ? tips.join(' ') : undefined,
  });

  const total = criteria.reduce((sum, c) => sum + c.score, 0);
  return { total, criteria };
}

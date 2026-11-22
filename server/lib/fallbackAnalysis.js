import { findPresetSkills } from './roles.js';

const FALLBACK_VERDICT = 'AI is busy, showing a skill match only';
const METRICS_FALLBACK_FIX =
  'Add numbers to your project results, like users or speed.';
const GENERAL_DEVELOPER_SKILLS = [
  'Git',
  'SQL',
  'REST APIs',
  'Testing',
  'Docker',
  'Data Structures',
  'Algorithms',
  'Linux',
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasSkillMention(normalizedText, skill) {
  const pattern = new RegExp(
    `(?<![a-z0-9])${escapeRegExp(skill.toLowerCase())}(?![a-z0-9])`,
  );
  return pattern.test(normalizedText);
}

export function fallbackAnalysis(text, targetRole) {
  const coreSkills = findPresetSkills(targetRole) ?? GENERAL_DEVELOPER_SKILLS;
  const normalizedText = text.toLowerCase();

  const skillsFound = [];
  const skillsMissing = [];

  for (const skill of coreSkills) {
    if (hasSkillMention(normalizedText, skill)) {
      skillsFound.push(skill);
    } else {
      skillsMissing.push(skill);
    }
  }

  const topFixes = skillsMissing
    .slice(0, 3)
    .map((skill) => `Add a project that shows ${skill}.`);

  if (topFixes.length < 3) {
    topFixes.push(METRICS_FALLBACK_FIX);
  }

  return {
    score: null,
    verdict: FALLBACK_VERDICT,
    skillsFound,
    skillsMissing,
    topFixes,
    fallback: true,
  };
}

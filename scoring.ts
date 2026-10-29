export type RuleResult = {
  id: string;
  title: string;
  passed: boolean;
  points: number;
  feedback: string;
};

export type ScoreResult = {
  score: number;
  rules: RuleResult[];
  failed_feedback: string[];
  word_count: number;
};

const audienceWords = /\b(founders?|ceos?|leaders?|sales|marketers?|marketing teams?|recruiters?|coaches?|consultants?|agencies|agency owners?|e-?commerce|saas|startups?|creators?|freelancers?|small businesses|b2b|business owners?|product managers?|hr teams?)\b/i;
const outcomeWords = /\b(leads?|revenue|sales|pipeline|customers?|clients?|conversions?|save|saving|reduce|increase|improve|grow|growth|time|costs?|hiring|retention|churn|engagement|reply rate|meetings?|pain|problem|struggle|avoid|without|results?|workflow|productivity|profit|bookings?)\b/i;
const curiosityWords = /\b(why|what if|mistake|myth|secret|nobody|no one|most|instead|but|surprisingly|the reason|truth|stop|before|after|lesson|learned|wrong|never|actually|here's why)\b|\?/i;

export function scoreHook(rawHook: string): ScoreResult {
  const hook = rawHook.trim();
  const words = hook.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];
  const count = words.length;
  const sentences = hook.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const uppercaseLetters = hook.match(/[A-Z]/g)?.length ?? 0;
  const lowercaseLetters = hook.match(/[a-z]/g)?.length ?? 0;
  const allCaps = uppercaseLetters > 8 && lowercaseLetters < 3;
  const repeatedPunctuation = /[!?.,]{3,}/.test(hook);

  const checks: Omit<RuleResult, 'points'>[] = [
    {
      id: 'length',
      title: 'Concise length',
      passed: count >= 8 && count <= 25,
      feedback: count < 8
        ? `Too short (${count} words). Add enough context to make the promise clear.`
        : count > 25
          ? `Too long (${count} words). Trim it to 8–25 words for a sharper opening.`
          : `Good length (${count} words).`,
    },
    {
      id: 'audience',
      title: 'Specific audience',
      passed: audienceWords.test(hook),
      feedback: audienceWords.test(hook)
        ? 'A recognizable audience or role is present.'
        : 'Name the audience or role, such as founders, sales leaders, or marketers.',
    },
    {
      id: 'outcome',
      title: 'Clear pain or outcome',
      passed: outcomeWords.test(hook),
      feedback: outcomeWords.test(hook)
        ? 'The hook points to a relevant pain point or outcome.'
        : 'Make the problem, desired result, or business impact more concrete.',
    },
    {
      id: 'curiosity',
      title: 'Curiosity or tension',
      passed: curiosityWords.test(hook),
      feedback: curiosityWords.test(hook)
        ? 'There is a question, contrast, or curiosity cue.'
        : 'Create curiosity with a question, contrast, surprising insight, or mistake.',
    },
    {
      id: 'readability',
      title: 'Easy to read',
      passed: count > 0 && sentences.length <= 2 && !allCaps && !repeatedPunctuation,
      feedback: count === 0
        ? 'Add a hook to score.'
        : sentences.length > 2
          ? 'Use one clear opening sentence, or at most two short sentences.'
          : allCaps || repeatedPunctuation
            ? 'Avoid all-caps writing and repeated punctuation.'
            : 'The opening is easy to scan.',
    },
  ];

  const rules: RuleResult[] = checks.map((check) => ({ ...check, points: check.passed ? 20 : 0 }));
  return {
    score: rules.reduce((sum, rule) => sum + rule.points, 0),
    rules,
    failed_feedback: rules.filter((rule) => !rule.passed).map((rule) => rule.feedback),
    word_count: count,
  };
}

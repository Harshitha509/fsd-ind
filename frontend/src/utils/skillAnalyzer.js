const TECH_SKILLS_DICTIONARY = [
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'go', 'rust', 'typescript',
  'react', 'angular', 'vue', 'svelte', 'node.js', 'express', 'django', 'flask', 'spring boot',
  'html', 'css', 'sass', 'tailwind', 'bootstrap',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase', 'supabase',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'github actions', 'terraform',
  'machine learning', 'data science', 'nlp', 'tensorflow', 'pytorch', 'pandas', 'numpy',
  'agile', 'scrum', 'git', 'rest api', 'graphql', 'ci/cd', 'linux'
];

export const analyzeJobDescription = (description, userSkills = []) => {
  if (!description) return { requiredSkills: [], matchedSkills: [], missingSkills: [], matchScore: 0 };
  
  const normalizedText = description.toLowerCase().replace(/[^\w\s\+#\-\.]/g, ' ');
  const foundSkills = new Set();
  
  TECH_SKILLS_DICTIONARY.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(normalizedText)) {
      foundSkills.add(skill);
    }
  });

  const requiredSkills = Array.from(foundSkills);
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
  
  const matchedSkills = [];
  const missingSkills = [];
  
  requiredSkills.forEach(reqSkill => {
    if (normalizedUserSkills.includes(reqSkill)) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const matchScore = requiredSkills.length > 0 
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
    : 0;

  return {
    requiredSkills,
    matchedSkills,
    missingSkills,
    matchScore
  };
};

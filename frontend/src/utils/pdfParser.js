export const extractSkillsFromPDF = async (file) => {
  // Dynamically load the massive PDF library ONLY when the user uploads a resume
  const pdfjsLib = await import('pdfjs-dist');
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + ' ';
  }

  // A solid dictionary of tech skills to look for in the resume
  const commonSkills = [
    'react', 'node.js', 'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'angular', 'vue', 'svelte', 'express', 'django',
    'flask', 'spring', 'git', 'github', 'gitlab', 'ci/cd', 'jenkins', 'agile', 'scrum', 'machine learning',
    'data analysis', 'figma', 'graphql', 'rest api', 'linux', 'unix', 'bash', 'powershell', 'php', 'laravel'
  ];
  
  const textLower = fullText.toLowerCase();
  const foundSkills = commonSkills.filter(skill => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    return regex.test(textLower);
  });

  return foundSkills;
};

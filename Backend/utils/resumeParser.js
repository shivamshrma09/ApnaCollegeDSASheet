const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromResume = async (fileBuffer, mimeType) => {
  let text = '';
  
  try {
    if (mimeType === 'application/pdf') {
      console.log('📄 Extracting text from PDF...');
      const data = await pdfParse(fileBuffer);
      text = data.text;
      console.log('✅ PDF text extracted successfully!');
      console.log('📝 Extracted Text (first 500 chars):', text.substring(0, 500));
      console.log('📊 Total text length:', text.length, 'characters');
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('📄 Extracting text from DOCX...');
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
      console.log('✅ DOCX text extracted successfully!');
      console.log('📝 Extracted Text (first 500 chars):', text.substring(0, 500));
      console.log('📊 Total text length:', text.length, 'characters');
    } else if (mimeType === 'application/msword') {
      console.log('📄 Extracting text from DOC...');
      text = fileBuffer.toString('utf8');
      console.log('✅ DOC text extracted (basic)!');
      console.log('📝 Extracted Text (first 500 chars):', text.substring(0, 500));
    } else {
      console.log('📄 Extracting text from unknown format...');
      text = fileBuffer.toString('utf8');
      console.log('✅ Text extracted as UTF-8!');
      console.log('📝 Extracted Text (first 500 chars):', text.substring(0, 500));
    }
  } catch (error) {
    console.error('❌ Error extracting text from resume:', error.message);
    console.log('📄 File type:', mimeType);
    console.log('📊 Buffer size:', fileBuffer.length, 'bytes');
    return { skills: [], experience: 0, education: [], projects: [] };
  }
  
  if (!text) {
    console.log('⚠️ No text extracted from resume!');
    return { skills: [], experience: 0, education: [], projects: [] };
  }
  
  console.log('🔍 Starting text analysis...');
  text = text.toLowerCase();
  
  // Common technical skills
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue',
    'html', 'css', 'sql', 'mongodb', 'mysql', 'postgresql', 'redis',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github',
    'typescript', 'php', 'c++', 'c#', '.net', 'spring', 'django',
    'flask', 'express', 'laravel', 'bootstrap', 'tailwind', 'sass',
    'webpack', 'babel', 'npm', 'yarn', 'jest', 'cypress', 'selenium',
    'jenkins', 'ci/cd', 'agile', 'scrum', 'rest api', 'graphql',
    'microservices', 'machine learning', 'ai', 'data science',
    'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn'
  ];

  // Extract skills
  const foundSkills = skillKeywords.filter(skill => 
    text.includes(skill) || text.includes(skill.replace('.', ''))
  );

  // Extract experience years
  const experiencePatterns = [
    /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi,
    /(\d+)\+?\s*(?:years?|yrs?)/gi,
    /experience.*?(\d+)\s*(?:years?|yrs?)/gi
  ];

  let experienceYears = [];
  experiencePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const years = match.match(/\d+/);
        if (years) experienceYears.push(parseInt(years[0]));
      });
    }
  });

  // Extract education
  const educationKeywords = [
    'bachelor', 'master', 'phd', 'degree', 'university', 'college',
    'b.tech', 'b.e', 'm.tech', 'm.e', 'mba', 'bca', 'mca',
    'computer science', 'software engineering', 'information technology'
  ];

  const foundEducation = educationKeywords.filter(edu => text.includes(edu));

  // Extract projects
  const projectPatterns = [
    /project[s]?[:\s-]*([^\n.]{15,120})/gi,
    /built[:\s-]*([^\n.]{15,120})/gi,
    /developed[:\s-]*([^\n.]{15,120})/gi,
    /created[:\s-]*([^\n.]{15,120})/gi,
    /designed[:\s-]*([^\n.]{15,120})/gi,
    /implemented[:\s-]*([^\n.]{15,120})/gi
  ];
  
  const foundProjects = [];
  projectPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        let cleaned = match.replace(/^(project[s]?|built|developed|created|designed|implemented)[:\s-]*/gi, '').trim();
        if (cleaned.length > 10 && cleaned.length < 100) {
          // Capitalize first letter
          cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
          foundProjects.push(cleaned);
        }
      });
    }
  });
  
  // Remove duplicates and limit to 5 projects
  const uniqueProjects = [...new Set(foundProjects)].slice(0, 5);

  console.log('✅ Resume analysis completed!');
  console.log('🔧 Skills found:', foundSkills.length, '-', foundSkills.slice(0, 5));
  console.log('📅 Experience years detected:', experienceYears, '-> Max:', experienceYears.length > 0 ? Math.max(...experienceYears) : 0);
  console.log('🎓 Education keywords found:', foundEducation.length, '-', foundEducation.slice(0, 3));
  console.log('🚀 Projects found:', uniqueProjects.length, '-', uniqueProjects.slice(0, 2));

  return {
    skills: foundSkills,
    experience: experienceYears.length > 0 ? Math.max(...experienceYears) : 0,
    education: foundEducation,
    projects: uniqueProjects,
    rawText: text
  };
};

module.exports = { extractTextFromResume };
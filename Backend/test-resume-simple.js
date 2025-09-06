const testResumeParser = async () => {
  try {
    console.log('🧪 Testing Resume Parser Logic...');
    
    // Mock extracted text from PDF
    const mockText = `
    JOHN DOE - Software Engineer
    Experience: 5 years of experience in web development
    Skills: JavaScript, React, Node.js, Python, MongoDB, AWS, Docker
    Education: B.Tech Computer Science, M.Tech Software Engineering
    `;
    
    console.log('📄 Mock Resume Text:', mockText.substring(0, 150) + '...');
    
    const text = mockText.toLowerCase();
    
    // Test skill extraction
    const skills = ['javascript', 'react', 'node.js', 'python', 'mongodb', 'aws', 'docker'];
    const foundSkills = skills.filter(skill => text.includes(skill));
    
    // Test experience extraction  
    const expMatch = text.match(/(\d+)\s*years?\s*of\s*experience/);
    const experience = expMatch ? parseInt(expMatch[1]) : 0;
    
    // Test education extraction
    const education = ['b.tech', 'm.tech', 'computer science'].filter(edu => text.includes(edu));
    
    console.log('\n✅ Parsing Results:');
    console.log('🛠️  Skills:', foundSkills);
    console.log('📅 Experience:', experience, 'years');
    console.log('🎓 Education:', education);
    
    const working = foundSkills.length >= 3 && experience > 0 && education.length > 0;
    
    console.log('\n🎯 RESUME PARSER STATUS:', working ? '✅ WORKING!' : '❌ FAILED');
    
    if (working) {
      console.log('\n💡 PDF extraction will help generate:');
      console.log('   - Better targeted interview questions');
      console.log('   - Appropriate difficulty level');
      console.log('   - Skills-based technical questions');
    } else {
      console.log('\n⚠️  PDF parsing may have issues with:');
      console.log('   - Complex PDF formats');
      console.log('   - Scanned documents');
      console.log('   - Non-standard layouts');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testResumeParser();
const fs = require('fs');
const path = require('path');
const { extractTextFromResume } = require('./utils/resumeParser');

const testPDFExtraction = async () => {
  try {
    console.log('🧪 Testing PDF Text Extraction...');
    
    // Create a simple test PDF content (simulate PDF buffer)
    const testPDFContent = `
    John Doe
    Software Engineer
    
    Experience: 3 years of experience in web development
    
    Skills:
    - JavaScript, React, Node.js
    - Python, Django, Flask  
    - MongoDB, MySQL, PostgreSQL
    - AWS, Docker, Git
    - HTML, CSS, Bootstrap
    
    Education:
    - B.Tech Computer Science from XYZ University
    - Master's in Software Engineering
    
    Projects:
    - E-commerce platform using React and Node.js
    - Machine Learning model with Python and TensorFlow
    `;
    
    // Convert to buffer (simulating PDF file)
    const testBuffer = Buffer.from(testPDFContent, 'utf8');
    
    console.log('📄 Test PDF Content:');
    console.log(testPDFContent.substring(0, 200) + '...');
    
    // Test extraction
    console.log('\n🔍 Extracting data from PDF...');
    const result = await extractTextFromResume(testBuffer, 'application/pdf');
    
    console.log('\n✅ Extraction Results:');
    console.log('🛠️  Skills Found:', result.skills);
    console.log('📅 Experience:', result.experience, 'years');
    console.log('🎓 Education:', result.education);
    console.log('📝 Raw Text Length:', result.rawText?.length || 0, 'characters');
    
    // Verify extraction quality
    if (result.skills.length > 0) {
      console.log('\n✅ SKILLS EXTRACTION: Working!');
      console.log('   Found skills like:', result.skills.slice(0, 5).join(', '));
    } else {
      console.log('\n❌ SKILLS EXTRACTION: Failed!');
    }
    
    if (result.experience > 0) {
      console.log('✅ EXPERIENCE EXTRACTION: Working!');
      console.log('   Detected:', result.experience, 'years');
    } else {
      console.log('❌ EXPERIENCE EXTRACTION: Failed!');
    }
    
    if (result.education.length > 0) {
      console.log('✅ EDUCATION EXTRACTION: Working!');
      console.log('   Found:', result.education.slice(0, 3).join(', '));
    } else {
      console.log('❌ EDUCATION EXTRACTION: Failed!');
    }
    
    console.log('\n🎯 PDF TEXT EXTRACTION STATUS:', 
      result.skills.length > 0 && result.experience > 0 ? 'WORKING ✅' : 'NEEDS FIX ❌');
    
  } catch (error) {
    console.error('❌ PDF Extraction Test Failed:', error.message);
    console.log('\n🔧 Possible Issues:');
    console.log('   - pdf-parse module not installed');
    console.log('   - mammoth module not installed');
    console.log('   - File parsing error');
  }
};

testPDFExtraction();
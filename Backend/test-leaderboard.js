const axios = require('axios');

async function testLeaderboard() {
  try {
    console.log('Testing leaderboard API...');
    
    // Test global leaderboard
    const response = await axios.get('http://localhost:5001/api/leaderboard/global?sheetType=apnaCollege');
    console.log('Leaderboard response:', response.data);
    
    // Test user rank (use a dummy user ID)
    const rankResponse = await axios.get('http://localhost:5001/api/leaderboard/rank/507f1f77bcf86cd799439011?sheetType=apnaCollege');
    console.log('User rank response:', rankResponse.data);
    
  } catch (error) {
    console.error('Error testing leaderboard:', error.response?.data || error.message);
  }
}

testLeaderboard();
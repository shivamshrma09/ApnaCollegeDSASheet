// Token management utility
export const tokenManager = {
  // Check if token exists and is valid
  isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Decode JWT to check expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        console.log('🕐 Token expired, removing from storage');
        this.clearToken();
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('❌ Invalid token format, removing from storage');
      this.clearToken();
      return false;
    }
  },
  
  // Clear token and user data
  clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get token
  getToken() {
    return localStorage.getItem('token');
  },
  
  // Set token
  setToken(token) {
    localStorage.setItem('token', token);
  }
};
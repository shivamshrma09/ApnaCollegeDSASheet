import React, { useEffect, useRef } from 'react';

const GoogleSignIn = ({ onSuccess, onError }) => {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Check if Google OAuth is enabled
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      // Show fallback message if Google OAuth is disabled
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = `
          <div style="
            padding: 12px 16px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            background: #f8f9fa;
            color: #5f6368;
            text-align: center;
            font-size: 14px;
          ">
            Google Sign-In temporarily disabled
          </div>
        `;
      }
      return;
    }
    
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup'
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        });
      }
    };

    const handleCredentialResponse = async (response) => {
      if (response.credential) {
        try {
          // Decode JWT to get user info
          const payload = JSON.parse(atob(response.credential.split('.')[1]));
          
          // Create enhanced response with avatar
          const enhancedResponse = {
            ...response,
            name: payload.name,
            email: payload.email,
            avatar: payload.picture // Google profile picture
          };
          
          onSuccess(enhancedResponse);
        } catch (error) {
          console.error('Error processing Google response:', error);
          onSuccess(response);
        }
      } else {
        onError('Authentication cancelled');
      }
    };

    if (googleClientId) {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        script.onerror = () => onError('Failed to load Google Sign-In');
        document.head.appendChild(script);
      } else {
        initializeGoogleSignIn();
      }
    }
  }, [onSuccess, onError]);

  return <div ref={googleButtonRef} style={{ width: '100%', minHeight: '40px' }}></div>;
};

export default GoogleSignIn;
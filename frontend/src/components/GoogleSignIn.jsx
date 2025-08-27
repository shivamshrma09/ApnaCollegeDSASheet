import React, { useEffect, useRef } from 'react';

const GoogleSignIn = ({ onSuccess, onError }) => {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: '650760834469-56i14787333t7i8lnh7ooo4t98g9a4q9.apps.googleusercontent.com',
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

    const handleCredentialResponse = (response) => {
      if (response.credential) {
        onSuccess(response);
      } else {
        onError('Authentication cancelled');
      }
    };

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
  }, [onSuccess, onError]);

  return <div ref={googleButtonRef} style={{ width: '100%', minHeight: '40px' }}></div>;
};

export default GoogleSignIn;
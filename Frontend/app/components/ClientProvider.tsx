'use client';

import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

export default function ClientProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "PLACEHOLDER_GOOGLE_CLIENT_ID";
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <Toaster position="top-right" />
        {children}
      </GoogleOAuthProvider>
    </Provider>
  );
}

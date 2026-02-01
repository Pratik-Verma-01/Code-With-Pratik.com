import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
        },
        success: {
          iconTheme: {
            primary: '#00f3ff',
            secondary: '#000',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#000',
          },
        },
      }}
    />
  );
}

import React from 'react';
import { Toaster, resolveValue } from 'react-hot-toast';
import Toast from './Toast';

const ToastContainer = () => {
  return (
    <Toaster position="top-right" gutter={12}>
      {(t) => (
        <Toast
          t={t}
          type={t.type}
          message={resolveValue(t.message, t)}
          icon={t.icon}
        />
      )}
    </Toaster>
  );
};

export default ToastContainer;

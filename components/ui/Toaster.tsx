import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  centered?: boolean;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, options?: { centered?: boolean }) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastCount = 0;

export const Toaster: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loadingToastId, setLoadingToastId] = useState<number | null>(null);

  const addToast = useCallback((message: string, type: ToastType, options?: { centered?: boolean }): number => {
    const id = toastCount++;
    if (type === 'loading') {
      // If there's an active loading toast, remove it first.
      if (loadingToastId !== null) {
          setToasts(prev => prev.filter(t => t.id !== loadingToastId));
      }
      setLoadingToastId(id);
    }
    setToasts(prev => [{ id, message, type, centered: options?.centered }, ...prev]);
    if (type !== 'loading') {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    }
    return id;
  }, [loadingToastId]);

  const dismiss = useCallback((id: number) => {
      setToasts(prev => prev.filter(t => t.id !== id));
      if (id === loadingToastId) {
        setLoadingToastId(null);
      }
  }, [loadingToastId]);

  // Center if the first toast is centered, else top-right
  const containerClass =
    toasts.length > 0 && toasts[0].centered
      ? 'fixed inset-0 z-[100] flex items-center justify-center pointer-events-none'
      : 'fixed top-0 right-0 z-[100] p-4 space-y-2 pointer-events-none';

  return (
    <ToastContext.Provider value={{ addToast, dismiss }}>
        <div className={containerClass}>
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                  <Toast {...toast} onDismiss={() => dismiss(toast.id)} />
                </div>
            ))}
        </div>
        {children}
        <ToastProvider />
    </ToastContext.Provider>
  );
};

const Toast: React.FC<ToastMessage & { onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  const icons: Record<ToastType, React.ReactNode> = {
    success: (
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    error: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    info: (
      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    loading: (
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    ),
  };
  
  return (
    <div className="max-w-md min-w-[320px] w-full bg-gray-900/80 backdrop-blur-md shadow-lg rounded-lg pointer-events-auto ring-1 ring-white/10 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-100">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={onDismiss} className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900">
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Global toast object
let toastApi: ToastContextType;

const ToastProvider: React.FC = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("ToastProvider must be used within a Toaster component");
    }
    toastApi = context;
    return null;
}

const originalToast = {
    success: (message: string, options?: { centered?: boolean }) => toastApi?.addToast(message, 'success', options),
    error: (message: string, options?: { centered?: boolean }) => toastApi?.addToast(message, 'error', options),
    info: (message: string, options?: { centered?: boolean }) => toastApi?.addToast(message, 'info', options),
    loading: (message: string, options?: { centered?: boolean }) => toastApi?.addToast(message, 'loading', options),
    dismiss: (id: number) => toastApi?.dismiss(id),
};

// A proxy to handle cases where toast is called before the provider is mounted.
export const toast = new Proxy(originalToast, {
    get(target, prop, receiver) {
        if (!toastApi) {
            // This can happen during hot-reloads or if called prematurely.
            // Return a no-op function to prevent crashes.
            return () => { 
              console.warn(`Toast function '${String(prop)}' called before Toaster is ready.`);
            };
        }
        return Reflect.get(target, prop, receiver);
    }
}) as typeof originalToast;
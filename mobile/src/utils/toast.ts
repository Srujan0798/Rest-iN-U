import Toast from 'react-native-toast-message';

export const showToast = {
  success: (message: string, title?: string) => {
    Toast.show({
      type: 'success',
      text1: title || 'Success',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
    });
  },

  error: (message: string, title?: string) => {
    Toast.show({
      type: 'error',
      text1: title || 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      topOffset: 50,
    });
  },

  info: (message: string, title?: string) => {
    Toast.show({
      type: 'info',
      text1: title || 'Info',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
    });
  },

  warning: (message: string, title?: string) => {
    Toast.show({
      type: 'error', // Using error type for warning with custom styling
      text1: title || 'Warning',
      text2: message,
      position: 'top',
      visibilityTime: 3500,
      topOffset: 50,
    });
  },
};

// Custom toast config for consistent styling
export const toastConfig = {
  success: (props: any) => (
    <Toast.BaseToast
      {...props}
      style={{
        borderLeftColor: '#22c55e',
        backgroundColor: '#1a1a2e',
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
      }}
      text2Style={{
        fontSize: 13,
        color: '#a1a1aa',
      }}
    />
  ),
  error: (props: any) => (
    <Toast.BaseToast
      {...props}
      style={{
        borderLeftColor: '#ef4444',
        backgroundColor: '#1a1a2e',
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
      }}
      text2Style={{
        fontSize: 13,
        color: '#a1a1aa',
      }}
    />
  ),
  info: (props: any) => (
    <Toast.BaseToast
      {...props}
      style={{
        borderLeftColor: '#6366f1',
        backgroundColor: '#1a1a2e',
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
      }}
      text2Style={{
        fontSize: 13,
        color: '#a1a1aa',
      }}
    />
  ),
};

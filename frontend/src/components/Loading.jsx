const Loading = ({ fullScreen = false }) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 flex items-center justify-center z-50"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-24 h-24 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full animate-pulse opacity-75"></div>
        </div>
        
        {/* Rocket icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-white animate-bounce" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2L4 12h5v8h6v-8h5L12 2zm0 3.84L16.27 11H14v7h-4v-7H7.73L12 5.84z"/>
          </svg>
        </div>
      </div>
      
      {fullScreen && (
        <div className="absolute bottom-8 text-center">
          <p className="text-white text-lg font-medium animate-pulse">
            Launching Systems...
          </p>
          <div className="flex justify-center gap-1 mt-2">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading;

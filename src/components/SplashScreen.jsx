const SplashScreen = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
      {/* Logo hoặc animation */}
      <img 
        src="/images/ico/logo_bingbong.ico" 
        alt="logo" 
        className="w-32 h-32 animate-bounce object-cover"
      />
    </div>
  );
};

export default SplashScreen;
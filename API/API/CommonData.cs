namespace API
{
    public static class CommonData
    {
        private static string _webRootPath;
        private static IHttpContextAccessor _httpContextAccessor;
        public static void Initialize(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _webRootPath = env.WebRootPath;
            _httpContextAccessor = httpContextAccessor;
        }
        public const string ErrorMessage = "Something went wrong please try again";
        
        public static string BaseUrl => GetBaseUrl(_httpContextAccessor);

        // File system paths - using Path.Combine for platform compatibility
        public static string ProjectContainerPath => Path.Combine(_webRootPath, "Uploads", "Container");
        public static string ProjectPath => Path.Combine(_webRootPath, "Uploads", "Project");
        public static string PhotoPath => Path.Combine(_webRootPath, "Uploads", "Photo");

        public static string SubProjectContainerPath => Path.Combine(_webRootPath, "Uploads", "SubContainer");
        public static string SubProjectPath => Path.Combine(_webRootPath, "Uploads", "SubProject");


        // URL methods (URLs always use forward slashes regardless of platform)
        public static string GetProjectContainerUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/Container/{fileName}";
        }
        public static string GetProjectUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/Project/{fileName}";
        }
        public static string GetPhotoUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/Photo/{fileName}";
        }
        public static string GetSubProjectContainerUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/SubContainer/{fileName}";
        }
        public static string GetSubProjectUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/SubProject/{fileName}";
        }
        public static string GetBaseUrl(IHttpContextAccessor httpContextAccessor)
        {
            var request = httpContextAccessor?.HttpContext?.Request;
            if (request == null) return "";
            // Check for X-Forwarded headers first
            string host = request.Headers["X-Forwarded-Host"].FirstOrDefault() ??
                         request.Headers["X-Original-Host"].FirstOrDefault() ??
                         request.Host.Value;
            string proto = request.Headers["X-Forwarded-Proto"].FirstOrDefault() ??
                          request.Scheme;
            // Check for base path in case the application is not hosted at root
            string pathBase = request.Headers["X-Forwarded-Path"].FirstOrDefault() ??
                             request.PathBase.Value;
            return $"{proto}://{host}{pathBase}".TrimEnd('/');
        }
    }
}
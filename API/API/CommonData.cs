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
        public const int PaperBillCalculationPercentage = 20;
        public const int PaymentDueDays = 30;
        
        // public const string ImageBaseUrl = "https://localhost:7026";
        public static string BaseUrl => GetBaseUrl(_httpContextAccessor);

        // File system paths - using Path.Combine for platform compatibility
        public static string ProjectContainerPath => Path.Combine(_webRootPath, "Uploads", "Banner");
        public static string ShopPath => Path.Combine(_webRootPath, "Uploads", "Shop");
        public static string AdvertisementPath => Path.Combine(_webRootPath, "Uploads", "Advertisement");
        public static string InvoicePath => Path.Combine(_webRootPath, "Uploads", "Invoice");
        public static string CustomerProfilePath => Path.Combine(_webRootPath, "Uploads", "CustomerProfile");

        // URL methods (URLs always use forward slashes regardless of platform)
        public static string GetShopUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/Shop/{fileName}";
        }

        public static string GetAdvertisementUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/Advertisement/{fileName}";
        }

        public static string GetInvoiceUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/Invoice/{fileName}";
        }

        public static string GetCustomerProfileUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/CustomerProfile/{fileName}";
        }

        public static string GetBannerUrl(string fileName)
        {
            return $"{BaseUrl}/Uploads/Banner/{fileName}";
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
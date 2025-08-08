using Core.DB;
using Microsoft.EntityFrameworkCore;
using Repository;
using API.Services;
using API.Helpers;
using AutoMapper;
using System.Security.Cryptography.X509Certificates;
using System.Reflection;
using API;
using Microsoft.Extensions.FileProviders;
using System.Net.Http.Headers;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext for SQL Server using connection string from appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add DbContext for CockroachDB with SSL and certificate configuration
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//{
//    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

//    options.UseNpgsql(connectionString, npgsqlOptions =>
//    {
//        npgsqlOptions.ProvideClientCertificatesCallback(certificates =>
//        {
//            var caCert = new X509Certificate2("/etc/ssl/certs/cockroach-ca.crt"); // CA certificate path
//            certificates.Add(caCert);
//        });
//    });
//});

// Configure AutoMapper
var mappingConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new Mappers());
});
IMapper mapper = mappingConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

// Configure CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod(); // Allow all origins, headers, and methods
    });
});
builder.Services.AddHttpContextAccessor();

//CommonData.Initialize(builder.Environment);
CommonData.Initialize(builder.Environment, builder.Services.BuildServiceProvider().GetRequiredService<IHttpContextAccessor>());

// Add Dependency Injection for other services
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Add GeoLocationService with HttpClient
builder.Services.AddScoped<IEncryptor, Encryptor>();

builder.Services.AddScoped<IEmailSender, EmailSender>();
builder.Services.AddScoped<IQRScan, QRScan>();
builder.Services.AddScoped<IMedia, Media>();
builder.Services.AddScoped<IMobileVerification, MobileVerification>();
//builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IBarCodes, BarCodes>();

builder.Services.AddScoped<IValidateUserService, ValidateUserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICommonService, CommonService>();
builder.Services.AddScoped<IBctUserService, BctUserService>();


// Configure IdentityServer and JWT Authentication
builder.Services.AddIdentityServer()
    .AddInMemoryClients(IdentityConfiguration.Clients())
    .AddInMemoryIdentityResources(IdentityConfiguration.IdentityResources())
    .AddInMemoryApiResources(IdentityConfiguration.ApiResources())
    .AddInMemoryApiScopes(IdentityConfiguration.ApiScopes())
    .AddTestUsers(IdentityConfiguration.TestUsers())
    .AddDeveloperSigningCredential();

// Add JWT authentication
builder.Services.AddJWTAuthentication();

// Configure Swagger to use Bearer Token Authentication
var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Your API",
        Version = "v1"
    });

    // Define the Bearer token security scheme
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\nExample: \"Bearer abcdef12345\""
    });

    // Add the security requirement for Bearer token
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

});


// Add services to the container
builder.Services.AddControllers();
//builder.Services.AddControllers()
//    .AddJsonOptions(options =>
//    {
//        options.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
//    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
    try
    {
        authService.CreateDefaultUser().Wait();
        Console.WriteLine("Default user creation process completed");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while creating default user: {ex.Message}");
    }
}

// Only enforce HTTPS redirection outside Development, so containerized dev works over HTTP
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();

// Enable CORS middleware
app.UseCors("CorsPolicy");


app.UseStaticFiles();
app.UseFileServer(new FileServerOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads")),
    RequestPath = "/Uploads",
    EnableDefaultFiles = true
});

app.UseIdentityServer();

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline
// if (app.Environment.IsDevelopment())
// {
app.UseSwagger();
app.UseSwaggerUI();
// }

app.MapControllers();

app.Run();


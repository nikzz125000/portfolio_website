using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System;
using System.Text;
using System.Security.Cryptography;
using Core.Models;
using IdentityModel;
using IdentityServer4.Test;
using IdentityServer4.Models;

namespace API.Helpers
{
    public static class ConfigureJWTAuthentication
    {
        private const string ISSUER = "DigiReceiptIssuer";//"DigiReceiptIssuer";
        private const string AUDIENCE = "DigiReceiptClient";//"DigiReceiptClient";
        private const string KEY = "TJSZMZeSaH0STcCAlij39AyqBhskLlXlGR4RwZFtd8BPLPVBvoDAiXwYYSUi3xMFo!AdfG";
        //private const string ISSUING_AUTHORITY = "https://digireceiptapi.clubactive.in";
        //private const string ISSUING_AUTHORITY = "https://digireceiptmasterapi.clubactive.in";
        private const string ISSUING_AUTHORITY = "https://Clk.biz.app.tukzo.xyz";

        private static long SHORT_LIFETIME_IN_SECONDS => 60 * 60; // 1hour
        private static long LONG_LIFETIME_IN_SECONDS => 180 * 24 * 60 * 60; // 180days
        private static long REFRESH_TOKEN_LIFETIME_IN_SECONDS => 365 * 24 * 60 * 60; // 1year
        private static SymmetricSecurityKey SYMMETRIC_SECURITY_KEY => new(Encoding.UTF8.GetBytes(KEY));
        private static long GetLifetimeInSeconds(bool RememberMe)
        {
            return RememberMe ? LONG_LIFETIME_IN_SECONDS : SHORT_LIFETIME_IN_SECONDS;
        }

        public static IServiceCollection AddJWTAuthentication(this IServiceCollection services)
        {
            _ = services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.Authority = ISSUING_AUTHORITY;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = ISSUER,
                    ValidateAudience = true,
                    ValidAudience = AUDIENCE,
                    ValidateLifetime = true,
                    IssuerSigningKey = SYMMETRIC_SECURITY_KEY,
                    ValidateIssuerSigningKey = true,
                };
            });

            //_ = services.AddAuthorization(options =>
            //{
            //    options.AddPolicy("ClientIdPolicy", policy => policy.RequireClaim("client_id", "DigiReceiptClient"));
            //});

            return services;
        }

        public static AccessTokenData GenerateBctUserAccessToken(BctUser user, string userGUID, bool RememberMe)
        {
            var claims = new List<Claim>
            {
                new Claim("UserId", userGUID),
                new Claim(ClaimTypes.Role, "VenderUser"),
                new Claim("IsEmailVerified", user.IsEmailVerified.ToString()),
                new Claim("IsMobileNumberVerified", user.IsMobileNumberVerified.ToString()),
                //new Claim("UserTypeCode", user.UserTypeCode.ToString()),
                new Claim("RememberMe", RememberMe.ToString())
            };
            var now = DateTime.UtcNow;
            var lifetime = GetLifetimeInSeconds(RememberMe);

            var jwt = new JwtSecurityToken(issuer: ISSUER,
                                           audience: AUDIENCE,
                                           claims: claims,
                                           notBefore: now,
                                           expires: now.AddSeconds(lifetime),
                                           signingCredentials: new SigningCredentials(SYMMETRIC_SECURITY_KEY, SecurityAlgorithms.HmacSha256));

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return new()
            {
                AccessToken = encodedJwt,
                ExpiresIn = lifetime
            };
        }

        public static AccessTokenData GenerateResetPasswordToken(string userName, string key)
        {
            var claims = new List<Claim>
            {
                new Claim("userName", userName),
                new Claim("key", key),
            };
            var now = DateTime.UtcNow;
            //var lifetime = GetLifetimeInSeconds(RememberMe);

            var jwt = new JwtSecurityToken(issuer: ISSUER,
                                           claims: claims,
                                           notBefore: now,
                                           //expires: now.AddSeconds(lifetime),
                                           signingCredentials: new SigningCredentials(SYMMETRIC_SECURITY_KEY, SecurityAlgorithms.HmacSha256));

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return new()
            {
                AccessToken = encodedJwt,
                //ExpiresIn = lifetime
            };
        }
        //public static AccessTokenData GenerateAdminAccessToken(Admins admin, bool RememberMe = false)
        //{
        //    var claims = new List<Claim>
        //    {
        //        new Claim("AdminId", admin.AdminId.ToString()),
        //        new Claim(ClaimTypes.Role, "AppUser"),
        //        new Claim("RememberMe", RememberMe.ToString())
        //    };
        //    var now = DateTime.UtcNow;
        //    var lifetime = GetLifetimeInSeconds(RememberMe);

        //    var jwt = new JwtSecurityToken(issuer: ISSUER,
        //                                   audience: AUDIENCE,
        //                                   claims: claims,
        //                                   notBefore: now,
        //                                   expires: now.AddSeconds(lifetime),
        //                                   signingCredentials: new SigningCredentials(SYMMETRIC_SECURITY_KEY, SecurityAlgorithms.HmacSha256));

        //    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

        //    return new()
        //    {
        //        AccessToken = encodedJwt,
        //        ExpiresIn = lifetime
        //    };
        //}

        public static RefreshTokenData GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            return new()
            {
                RefreshToken = Convert.ToBase64String(randomNumber),
                ExpiryTime = DateTime.UtcNow.AddYears(1)
            };
        }

        public static ClaimsPrincipal GetPrincipalClaims(string accessToken)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true, //you might want to validate the audience and issuer depending on your use case
                ValidAudience = AUDIENCE,
                ValidateIssuer = true,
                ValidIssuer = ISSUER,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = SYMMETRIC_SECURITY_KEY,
                ValidateLifetime = true //here we are saying that we don't care about the token's expiration date
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token: accessToken, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return null; //throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }
    }

    public class AccessTokenData
    {
        public string AccessToken { get; set; }
        public long ExpiresIn { get; set; }
    }
    public class RefreshTokenData
    {
        public string RefreshToken { get; set; }
        public DateTime ExpiryTime { get; set; }
    }

    public static class IdentityConfiguration
    {
        public static List<TestUser> TestUsers()
        {
            return new List<TestUser>
            {
                new TestUser
                {
                    SubjectId = "123",
                    Username = "testuser",
                    Password = "Test@123",
                    Claims =
                    {
                        new Claim(JwtClaimTypes.Name, "test"),
                        new Claim(JwtClaimTypes.GivenName, "testuser"),
                        new Claim(JwtClaimTypes.FamilyName, "user"),
                    }
                }
            };
        }

        public static IEnumerable<IdentityResource> IdentityResources()
        {
            return new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
            };
        }

        public static IEnumerable<ApiScope> ApiScopes()
        {
            return new ApiScope[]
            {
                new ApiScope("api.read"),
                new ApiScope("api.write"),
            };
        }

        public static IEnumerable<ApiResource> ApiResources()
        {
            return new ApiResource[]
            {
                new ApiResource("myApi")
                {
                    Scopes = new List<string>{ "Api.read","Api.write" },
                    ApiSecrets = new List<Secret>{ new Secret("secret".Sha256()) }
                }
            };
        }

        public static IEnumerable<Client> Clients()
        {
            return new Client[]
            {
                new Client
                {
                    ClientId = "client",
                    ClientName = "DigiReceiptClient",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets = { new Secret("secret".Sha256()) },
                    AllowedScopes = { "api.read" }
                },
            };
        }
    }


}

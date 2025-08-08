using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Helpers
{
    public interface IMiscellaneousFunctions
    {
        string RandomPassord(int len);
        

    }
    public class MiscellaneousFunctions: IMiscellaneousFunctions
    {
        private readonly IConfiguration _configuration;

        public MiscellaneousFunctions(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        /// <summary>
        /// create random password
        /// </summary>
        /// <param name="len"></param>
        /// <returns></returns>
        public string RandomPassord(int len)
        {

            const string validChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#!$%*";
            StringBuilder radomPassword = new StringBuilder();
            Random ran = new Random();
            while (0 < len--)
            {
                radomPassword.Append(validChar[ran.Next(validChar.Length)]);
            }
            return radomPassword.ToString();
        }
    }

   
}

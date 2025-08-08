using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace API.Helpers
{
    public interface IEncryptor
    {
       // public string Encrypt1(string value);
        public string EncryptIDs(string value);
        public string DecryptIDs(string value);
       // public string Encrypt(string value , string hash);
        //public string Decrypt(string value, string hash);
        bool IsEqualPassword(string ProvidedPassword, string ActuallPassword);
        public string EncryptByHash(string value);
       // public string DecryptByHash(string value);


    }
    public class Encryptor : IEncryptor
    {

        //private static readonly byte[] key = Encoding.UTF8.GetBytes("YourEncryptionKey"); // 16, 24, or 32 bytes
        //private static readonly byte[] iv = Encoding.UTF8.GetBytes("YourIVVector123"); // 16 bytes
        private static readonly byte[] key = Encoding.UTF8.GetBytes("0123456789ABCDEF"); // 16 bytes for 128-bit key
        private static readonly byte[] iv = Encoding.UTF8.GetBytes("1234567890ABCDEF"); // 16 bytes for AES


        /// <summary>
        /// descrypt the string using key
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        //public string DecryptByHash(string value)
        //{
        //    string hash = "f0xle@rn";
        //    byte[] data = Convert.FromBase64String(value);
        //    using (MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider())
        //    {
        //        byte[] keys = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(hash));
        //        using (TripleDESCryptoServiceProvider tripDes = new TripleDESCryptoServiceProvider()
        //        {
        //            Key = keys,
        //            Mode = CipherMode.ECB,
        //            Padding = PaddingMode.PKCS7
        //        })
        //        {
        //            ICryptoTransform transform = tripDes.CreateDecryptor();
        //            byte[] results = transform.TransformFinalBlock(data, 0, data.Length);
        //            return UTF8Encoding.UTF8.GetString(results);
        //        }
        //    }
        //}
        
        //public string Decrypt(string value, string hash)
        //{
        //    byte[] data = Convert.FromBase64String(value);
        //    using (MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider())
        //    {
        //        byte[] keys = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(hash));
        //        using (TripleDESCryptoServiceProvider tripDes = new TripleDESCryptoServiceProvider()
        //        {
        //            Key = keys,
        //            Mode = CipherMode.ECB,
        //            Padding = PaddingMode.PKCS7
        //        })
        //        {
        //            ICryptoTransform transform = tripDes.CreateDecryptor();
        //            byte[] results = transform.TransformFinalBlock(data, 0, data.Length);
        //            return UTF8Encoding.UTF8.GetString(results);
        //        }
        //    }
        //}
        /// <summary>
        ///  //Encryptor the string using key
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public string EncryptByHash(string value)
        {
            //string hash = "f0xle@rn";
            //byte[] data = UTF8Encoding.UTF8.GetBytes(value);
            //using (MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider())
            //{
            //    byte[] keys = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(hash));
            //    using (TripleDESCryptoServiceProvider tripDes = new TripleDESCryptoServiceProvider()
            //    {
            //        Key = keys,
            //        Mode = CipherMode.ECB,
            //        Padding = PaddingMode.PKCS7
            //    })
            //    {
            //        ICryptoTransform transform = tripDes.CreateEncryptor();
            //        byte[] results = transform.TransformFinalBlock(data, 0, data.Length);
            //        return Convert.ToBase64String(results, 0, results.Length);
            //    }
            //}

            string saltstring = "uzv5tos4d89SdAZTE3IKdQ==";
            //byte[] salt = new byte[16];
            //using (var rng = RandomNumberGenerator.Create())
            //{
            //    rng.GetBytes(salt);
            //}
            //saltstring= Convert.ToBase64String(salt);
            byte[] salt = Convert.FromBase64String(saltstring);
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: value,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));
            return hashed;
        }
        public string EncryptIDs(string value)
        {
            using (var aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;

                var encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (var msEncrypt = new MemoryStream())
                {
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (var swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(value);
                        }
                    }

                    byte[] encrypted = msEncrypt.ToArray();
                    return Convert.ToBase64String(encrypted).Replace('+', '-').Replace('/', '_').TrimEnd('=');
                }
            }

            //string hash = "f0xle@rn";
            //byte[] data = UTF8Encoding.UTF8.GetBytes(value);
            //using(MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider())
            //{
            //    byte[] keys = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(hash));
            //    using(TripleDESCryptoServiceProvider tripDes=new TripleDESCryptoServiceProvider()
            //    {
            //        Key=keys,
            //        Mode=CipherMode.ECB,
            //        Padding=PaddingMode.PKCS7
            //    })
            //    {
            //        ICryptoTransform transform = tripDes.CreateEncryptor();
            //        byte[] results = transform.TransformFinalBlock(data, 0, data.Length);
            //        return  Convert.ToBase64String(results, 0, results.Length);
            //    }
            //}
        }
        public string DecryptIDs(string cipherText)
        {
            cipherText = cipherText.Replace('-', '+').Replace('_', '/');

            // Pad the string with = characters until its length is a multiple of 4
            int padding = (4 - cipherText.Length % 4) % 4;
            cipherText = cipherText.PadRight(cipherText.Length + padding, '=');

            byte[] cipherBytes = Convert.FromBase64String(cipherText);

            using (var aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;

                var decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (var msDecrypt = new MemoryStream(cipherBytes))
                {
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (var srDecrypt = new StreamReader(csDecrypt))
                        {
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
            //string hash = "f0xle@rn";
            //byte[] data = Convert.FromBase64String(value);
            //using (MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider())
            //{
            //    byte[] keys = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(hash));
            //    using (TripleDESCryptoServiceProvider tripDes = new TripleDESCryptoServiceProvider()
            //    {
            //        Key = keys,
            //        Mode = CipherMode.ECB,
            //        Padding = PaddingMode.PKCS7
            //    })
            //    {
            //        ICryptoTransform transform = tripDes.CreateDecryptor();
            //        byte[] results = transform.TransformFinalBlock(data, 0, data.Length);
            //       return UTF8Encoding.UTF8.GetString(results);
            //    }
            //}
        }
        //public string Encrypt(string value, string hash)
        //{
        //    byte[] data = UTF8Encoding.UTF8.GetBytes(value);
        //    using (MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider())
        //    {
        //        byte[] keys = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(hash));
        //        using (TripleDESCryptoServiceProvider tripDes = new TripleDESCryptoServiceProvider()
        //        {
        //            Key = keys,
        //            Mode = CipherMode.ECB,
        //            Padding = PaddingMode.PKCS7
        //        })
        //        {
        //            ICryptoTransform transform = tripDes.CreateEncryptor();
        //            byte[] results = transform.TransformFinalBlock(data, 0, data.Length);
        //            return Convert.ToBase64String(results, 0, results.Length);
        //        }
        //    }
        //}

        /// <summary>
        ///  //Encryptor the string without key
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        //public string Encrypt1(string value)
        //{
        //    MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
        //    UTF8Encoding utf8 = new UTF8Encoding();
        //    byte[] data = md5.ComputeHash(utf8.GetBytes(value));
        //    return Convert.ToBase64String(data);
        //}

        public bool IsEqualPassword(string ProvidedPassword, string ActuallPassword)
        {
            return ProvidedPassword.ToString().Equals(ActuallPassword.ToString());
        }

        public static String HashPassword1(string password, string saltstring)
        {

            byte[] salt = Convert.FromBase64String(saltstring);
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));
            return hashed;
        }
    }


}

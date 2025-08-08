using QRCoder;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ViewModels;
using Microsoft.AspNetCore.Hosting;
//using static System.Net.Mime.MediaTypeNames;

namespace API.Helpers
{
    public interface IQRScan
    {
        Task<string> CreateQRCode(string qrInput, string fileName);
      
        bool RemoveQRCode(string filePath);
    

    }
    public class QRScan : IQRScan
    {
        protected readonly IWebHostEnvironment _env;
        public QRScan(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// craete qr file in Png format
        /// </summary>
        /// <param name="qrInput"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public async Task<string> CreateQRCode(string qrInput, string fileName)
        {
            
            QRCodeGenerator qr = new QRCodeGenerator();
            QRCodeData data = qr.CreateQrCode(qrInput, QRCodeGenerator.ECCLevel.Q);
            PngByteQRCode code = new PngByteQRCode(data);
            //QRCode code = new QRCode(data);
            byte[] bmp = code.GetGraphic(5);
            //https://github.com/codebude/QRCoder/issues/361#issuecomment-992152570
            
            // SaveQR(bmp);

            //save QR
            // var directoryPath = "C:\\QRImages";
            var directoryPath = _env.WebRootPath+ @"\QRScans";
            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);
            //string  fileNamePath = directoryPath + "\\" + fileName+".png";
            string fileNamePath = Path.Combine(directoryPath, fileName + ".png");

            // Save the byte array to a file
            File.WriteAllBytes(fileNamePath, bmp);
            //bmp.Save(fileNamePath);
              return  fileName + ".png";


        }
        /// <summary>
        /// Remove QR file
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public  bool RemoveQRCode(string filePath)
        {
            var directoryPath = _env.WebRootPath;// + @"\QRScans\\";
           // filePath = directoryPath + "\\" + filePath;
            if (File.Exists(directoryPath + filePath))
            {
                File.Delete(directoryPath + filePath);
              
            }
            return true;
        }

        
    }


}


using IronBarCode;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;


namespace API.Helpers
{
    public interface IBarCodes
    {
        Task<string> CreateBarCode(string qrInput, string fileName);

        bool RemoveBarCode(string filePath);
    }
    public class BarCodes : IBarCodes
    {
        protected readonly IWebHostEnvironment _env;
        public BarCodes(IWebHostEnvironment env)
        {
            _env = env;
        }
        ///// <summary>
        ///// craete BaeCode file in Png format
        ///// </summary>
        ///// <param name="barInput"></param>
        ///// <param name="fileName"></param>
        ///// <returns></returns>
        //public async Task<string> CreateBarCode1(string barInput, string fileName)
        //{
        //    GeneratedBarcode barcode = IronBarCode.BarcodeWriter.CreateBarcode(barInput, BarcodeWriterEncoding.Code128);
        //    barcode.ResizeTo(500, 150);
        //    barcode.AddBarcodeValueTextBelowBarcode();
        //    barcode.ChangeBarCodeColor(Color.AliceBlue,true);
        //    barcode.SetMargins(10);
        //   // string path = Path.Combine()

        //    //save QR
        //    // var directoryPath = "C:\\QRImages";
        //    var directoryPath = _env.WebRootPath + @"\BarCodes";
        //    if (!Directory.Exists(directoryPath))
        //        Directory.CreateDirectory(directoryPath);
        //    string fileNamePath = directoryPath + "\\" + fileName + ".png";
        //   barcode.SaveAsPng(fileNamePath);
        //    return fileName.ToString() + ".png";
        //}
        /// <summary>
        /// craete BaeCode file in Png format
        /// </summary>
        /// <param name="barInput"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        //public async Task<string> CreateBarCode(string barInput, string fileName)
        //{
        //    Zen.Barcode.Code128BarcodeDraw barcode = Zen.Barcode.BarcodeDrawFactory.Code128WithChecksum;
        //    var image = barcode.Draw(barInput, 200);
        //    //save QR
        //    // var directoryPath = "C:\\QRImages";
        //    var directoryPath = _env.WebRootPath + @"\BarCodes";
        //    if (!Directory.Exists(directoryPath))
        //        Directory.CreateDirectory(directoryPath);
        //    string fileNamePath = directoryPath + "\\" + fileName + ".png";
        //    image.Save(fileNamePath);
        //    return fileName.ToString() + ".png";
        //}
        public async Task<string> CreateBarCode(string barInput, string fileName)
        {
            // Generate a Code128 barcode
            var barcode = BarcodeWriter.CreateBarcode(barInput, BarcodeEncoding.Code128);

            // Define the directory path where barcode images will be saved
            var directoryPath = Path.Combine(_env.WebRootPath, "BarCodes");

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            // Define the full path with file name
            string fileNamePath = Path.Combine(directoryPath, fileName + ".png");

            // Save the barcode as a PNG image
            barcode.SaveAsPng(fileNamePath);

            return fileName + ".png";
        }
        /// <summary>
        /// Remove BarCode file
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public bool RemoveBarCode(string filePath)
        {
            var directoryPath = _env.WebRootPath;// + @"\BarCodes\\";
            // filePath = directoryPath + "\\" + filePath;
            if (File.Exists(directoryPath + filePath))
            {
                File.Delete(directoryPath + filePath);

            }
            return true;
        }
    }

    
}

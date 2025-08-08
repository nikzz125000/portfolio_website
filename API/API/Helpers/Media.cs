using Shared.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public interface IMedia
    {
        Task<string> SaveFile(string path, IFormFile file);
        void RemoveFile(string filePath);

        Task<bool> SaveFileWithFileName(string path, IFormFile file, string fileName);
        Task<FileType> GetFileType(IFormFile file);
    }
    public class Media : IMedia
    {
        //Uploading Files 
        public async Task<string> SaveFile(string path, IFormFile file)
        {
            string fileName = null;
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            string fileId = Guid.NewGuid().ToString("N");
            string extension = Path.GetExtension(file.FileName).Substring(1);
            fileName = $"{fileId}.{extension}";
            
            using (var fileStream = new FileStream(Path.Combine(path, fileName), FileMode.Create))
            {
                fileStream.Position = 0;
                await file.CopyToAsync(fileStream);
                fileStream.Flush();
            }

            return fileName;
        }
        public async Task<bool> SaveFileWithFileName(string path, IFormFile file , string fileName)
        {
            try
            {
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                // fileName = fileName + "_" + DateTime.Now.ToString("yyyy-MM-ddThhmmss");
                //string extension = Path.GetExtension(file.FileName).Substring(1);
                //fileName = $"{fileName}.{extension}";
                //using (var fileStream = new FileStream(path + @"\" + fileName, FileMode.Create))
                //{
                //    fileStream.Position = 0;
                //    await file.CopyToAsync(fileStream);
                //    fileStream.Flush();
                //}
                using (var fileStream = new FileStream(Path.Combine(path, fileName), FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                    fileStream.Flush();
                }
                return true;

            }
            catch (Exception ex) {
                throw new Exception(ex.StackTrace);
            }
            
            //return true;
        }

        // /// <summary>
        /// Remove  file
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public void RemoveFile(string filePath)
        {
            var directoryPath = filePath;
            // filePath = directoryPath + "\\" + filePath;
            if (File.Exists(filePath))
            {
                File.Delete(filePath);

            }
            
        }
        public async Task<FileType> GetFileType(IFormFile file)
        {
            if (file == null)
            {
                throw new ArgumentException("File cannot be null", nameof(file));
            }

            string mimeType = file.ContentType.ToLowerInvariant();

            if (mimeType.StartsWith("image/"))
            {
                return  FileType.Image;
            }
            else if (mimeType.StartsWith("video/"))
            {
                return FileType.Video;

            }
            else if (mimeType.StartsWith("audio/"))
            {
                return FileType.Audio;
            }
            else if (mimeType == "application/pdf")
            {
                return FileType.PDF_Document;
            }
            else if (mimeType == "application/msword" || mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            {
                return FileType.Word_Document;
            }
            else if (mimeType == "application/vnd.ms-excel" || mimeType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            {
                return FileType.Excel_Spreadsheet;
            }
            else if (mimeType == "application/vnd.ms-powerpoint" || mimeType == "application/vnd.openxmlformats-officedocument.presentationml.presentation")
            {
                return FileType.PowerPoint_Presentation;
            }
            else if (mimeType == "text/plain")
            {
                return FileType.Text_Document;
            }
            else if (mimeType == "application/zip" || mimeType == "application/x-rar-compressed" || mimeType == "application/x-7z-compressed" || mimeType == "application/gzip")
            {
                return FileType.Compressed_Archive;

            }
            else
            {
                return FileType.Unknown;
            }
        }


    }


}

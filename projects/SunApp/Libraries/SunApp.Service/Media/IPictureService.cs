using Microsoft.AspNetCore.Http;
using SunApp.Core;
using SunApp.Core.Entities.Media;
using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Service.Media
{
    public interface IPictureService
    {
        Picture InsertPicture(byte[] pictureBinary, string mimeType, string originalFileName,
            string altAttribute = null, string titleAttribute = null,
            bool isNew = true, bool validateBinary = true);
        Picture InsertPicture(IFormFile formFile, string defaultFileName = "", string virtualPath = "");
        Picture UpdatePicture(int pictureId, byte[] pictureBinary, string mimeType,
            string originalFileName, string altAttribute = null, string titleAttribute = null,
            bool isNew = true, bool validateBinary = true);
        Picture UpdatePicture(Picture picture);
        byte[] ValidatePicture(byte[] pictureBinary, string mimeType);
        string GetFileExtensionFromMimeType(string mimeType);
        Picture GetPictureById(int pictureId);
        void DeletePicture(Picture picture);
        string GetPictureUrl(Picture picture,
           int targetSize = 0,
           bool showDefaultPicture = true,
           PictureType defaultPictureType = PictureType.Entity);
        string GetPictureUrl(int pictureId,
            int targetSize = 0,
            bool showDefaultPicture = true,
            PictureType defaultPictureType = PictureType.Entity);
        string GetDefaultPictureUrl(int targetSize = 0, PictureType defaultPictureType = PictureType.Entity);
    }
}

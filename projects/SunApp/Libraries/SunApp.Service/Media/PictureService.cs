using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Linq;
using Microsoft.AspNetCore.Http;
using SunApp.Common;
using SunApp.Core.Data;
using SunApp.Core.Entities.Media;
using SunApp.Core.Infrastructure;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Bmp;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using static SixLabors.ImageSharp.Configuration;
using SunApp.Core;
using System.Threading;

namespace SunApp.Service.Media
{
    public partial class PictureService : IPictureService
    {
        #region Fields
        private readonly IRepository<Picture> _pictureRepository;
        private readonly IRepository<PictureBinary> _pictureBinaryRepository;
        private readonly IMyFileProvider _fileProvider;
        private readonly IHttpContextAccessor _httpContextAccessor;
        #endregion
        #region Ctor
        public PictureService(
            IRepository<Picture> pictureRepository,
            IRepository<PictureBinary> pictureBinaryRepository,
            IMyFileProvider fileProvider,
            IHttpContextAccessor httpContextAccessor
            )
        {
            _pictureBinaryRepository = pictureBinaryRepository;
            _pictureRepository = pictureRepository;
            _fileProvider = fileProvider;
            _httpContextAccessor = httpContextAccessor;
        }
        #endregion
        #region Methods

        public void DeletePicture(Picture picture)
        {
            if (picture == null)
                throw new ArgumentNullException(nameof(picture));

            //delete thumbs
            DeletePictureThumbs(picture);
            //delete from database
            _pictureRepository.Delete(picture);
        }

        public string GetFileExtensionFromMimeType(string mimeType)
        {
            if (mimeType == null)
                return null;
            var parts = mimeType.Split('/');
            var lastPart = parts[parts.Length - 1];
            switch (lastPart)
            {
                case "pjpeg":
                    lastPart = "jpg";
                    break;
                case "x-png":
                    lastPart = "png";
                    break;
                case "x-icon":
                    lastPart = "ico";
                    break;
            }

            return lastPart;
        }

        public Picture GetPictureById(int pictureId)
        {
            if (pictureId == 0)
                return null;

            return _pictureRepository.GetById(pictureId);
        }

        public Picture InsertPicture(byte[] pictureBinary, string mimeType, string originalFileName, string altAttribute = null, string titleAttribute = null, bool isNew = true, bool validateBinary = true)
        {
            mimeType = CommonHelper.EnsureNotNull(mimeType);
            mimeType = CommonHelper.EnsureMaximumLength(mimeType, 20);

            originalFileName = CommonHelper.EnsureMaximumLength(originalFileName, 100);

            if (validateBinary)
                pictureBinary = ValidatePicture(pictureBinary, mimeType);

            var picture = new Picture
            {
                MimeType = mimeType,
                OriginalFileName = originalFileName,
                AltAttribute = altAttribute,
                TitleAttribute = titleAttribute,
                IsNew = isNew
            };
            _pictureRepository.Insert(picture);
            UpdatePictureBinary(picture, pictureBinary);
            return picture;

        }
        protected virtual PictureBinary UpdatePictureBinary(Picture picture, byte[] binaryData)
        {
            if (picture == null)
                throw new ArgumentNullException(nameof(picture));

            var pictureBinary = picture.PictureBinary;

            var isNew = pictureBinary == null;

            if (isNew)
                pictureBinary = new PictureBinary
                {
                    PictureId = picture.Id
                };

            pictureBinary.BinaryData = binaryData;

            if (isNew)
                _pictureBinaryRepository.Insert(pictureBinary);
            else
                _pictureBinaryRepository.Update(pictureBinary);

            return pictureBinary;
        }
        public Picture InsertPicture(IFormFile formFile, string defaultFileName = "", string virtualPath = "")
        {
            var imgExt = new List<string>
            {
                ".bmp",
                ".gif",
                ".jpeg",
                ".jpg",
                ".jpe",
                ".jfif",
                ".pjpeg",
                ".pjp",
                ".png",
                ".tiff",
                ".tif"
            } as IReadOnlyCollection<string>;

            var fileName = formFile.FileName;
            if (string.IsNullOrEmpty(fileName) && !string.IsNullOrEmpty(defaultFileName))
                fileName = defaultFileName;

            //remove path (passed in IE)
            fileName = _fileProvider.GetFileName(fileName);

            var contentType = formFile.ContentType;

            var fileExtension = _fileProvider.GetFileExtension(fileName);
            if (!string.IsNullOrEmpty(fileExtension))
                fileExtension = fileExtension.ToLowerInvariant();

            if (imgExt.All(ext => !ext.Equals(fileExtension, StringComparison.CurrentCultureIgnoreCase)))
                return null;

            //contentType is not always available 
            //that's why we manually update it here
            //http://www.sfsu.edu/training/mimetype.htm
            if (string.IsNullOrEmpty(contentType))
            {
                switch (fileExtension)
                {
                    case ".bmp":
                        contentType = MimeTypes.ImageBmp;
                        break;
                    case ".gif":
                        contentType = MimeTypes.ImageGif;
                        break;
                    case ".jpeg":
                    case ".jpg":
                    case ".jpe":
                    case ".jfif":
                    case ".pjpeg":
                    case ".pjp":
                        contentType = MimeTypes.ImageJpeg;
                        break;
                    case ".png":
                        contentType = MimeTypes.ImagePng;
                        break;
                    case ".tiff":
                    case ".tif":
                        contentType = MimeTypes.ImageTiff;
                        break;
                    default:
                        break;
                }
            }

            var picture = InsertPicture(CommonHelper.GetDownloadBits(formFile), contentType, _fileProvider.GetFileNameWithoutExtension(fileName));

            if (string.IsNullOrEmpty(virtualPath))
                return picture;

            picture.VirtualPath = _fileProvider.GetVirtualPath(virtualPath);
            _pictureRepository.Update(picture);

            return picture;
        }

        public Picture UpdatePicture(int pictureId, byte[] pictureBinary, string mimeType, string originalFileName, string altAttribute = null, string titleAttribute = null, bool isNew = true, bool validateBinary = true)
        {
            mimeType = CommonHelper.EnsureNotNull(mimeType);
            mimeType = CommonHelper.EnsureMaximumLength(mimeType, 20);

            originalFileName = CommonHelper.EnsureMaximumLength(originalFileName, 100);

            if (validateBinary)
                pictureBinary = ValidatePicture(pictureBinary, mimeType);

            var picture = GetPictureById(pictureId);
            if (picture == null)
                return null;

            //delete old thumbs if a picture has been changed
            if (originalFileName != picture.OriginalFileName)
                DeletePictureThumbs(picture);

            picture.MimeType = mimeType;
            picture.OriginalFileName = originalFileName;
            picture.AltAttribute = altAttribute;
            picture.TitleAttribute = titleAttribute;
            picture.IsNew = isNew;

            _pictureRepository.Update(picture);
            UpdatePictureBinary(picture, pictureBinary);

            return picture;
        }

        public Picture UpdatePicture(Picture picture)
        {
            if (picture == null)
                return null;

            var originalFileName = CommonHelper.EnsureMaximumLength(picture.OriginalFileName, 100);

            //delete old thumbs if a picture has been changed
            if (originalFileName != picture.OriginalFileName)
                DeletePictureThumbs(picture);

            picture.OriginalFileName = originalFileName;

            _pictureRepository.Update(picture);
            UpdatePictureBinary(picture, new byte[0]);

            return picture;
        }

        public byte[] ValidatePicture(byte[] pictureBinary, string mimeType)
        {
            using (var image = Image.Load(pictureBinary, out var imageFormat))
            {
                //resize the image in accordance with the maximum size
                if (Math.Max(image.Height, image.Width) > MediaConfigDefault.MaximumImageSize)
                {
                    image.Mutate(imageProcess => imageProcess.Resize(new ResizeOptions
                    {
                        Mode = ResizeMode.Max,
                        Size = new Size(MediaConfigDefault.MaximumImageSize)
                    }));
                }

                return EncodeImage(image, imageFormat);
            }
        }
        /// <summary>
        /// Encode the image into a byte array in accordance with the specified image format
        /// </summary>
        /// <typeparam name="T">Pixel data type</typeparam>
        /// <param name="image">Image data</param>
        /// <param name="imageFormat">Image format</param>
        /// <param name="quality">Quality index that will be used to encode the image</param>
        /// <returns>Image binary data</returns>
        protected virtual byte[] EncodeImage<TPixel>(Image<TPixel> image, IImageFormat imageFormat, int? quality = null) where TPixel : struct, IPixel<TPixel>
        {
            using (var stream = new MemoryStream())
            {
                var imageEncoder = Default.ImageFormatsManager.FindEncoder(imageFormat);
                switch (imageEncoder)
                {
                    case JpegEncoder jpegEncoder:
                        jpegEncoder.Subsample = JpegSubsample.Ratio444;
                        jpegEncoder.Quality = quality ?? MediaConfigDefault.DefaultImageQuality;
                        jpegEncoder.Encode(image, stream);
                        break;

                    case PngEncoder pngEncoder:
                        pngEncoder.ColorType = PngColorType.RgbWithAlpha;
                        pngEncoder.Encode(image, stream);
                        break;

                    case BmpEncoder bmpEncoder:
                        bmpEncoder.BitsPerPixel = BmpBitsPerPixel.Pixel32;
                        bmpEncoder.Encode(image, stream);
                        break;

                    case GifEncoder gifEncoder:
                        gifEncoder.Encode(image, stream);
                        break;

                    default:
                        imageEncoder.Encode(image, stream);
                        break;
                }

                return stream.ToArray();
            }
        }
        protected virtual void DeletePictureThumbs(Picture picture)
        {
            var filter = $"{picture.Id:0000000}*.*";
            var currentFiles = _fileProvider.GetFiles(_fileProvider.GetAbsolutePath(MediaConfigDefault.ImageThumbsLocalPath), filter, false);
            foreach (var currentFileName in currentFiles)
            {
                var thumbFilePath = GetThumbLocalPath(currentFileName);
                _fileProvider.DeleteFile(thumbFilePath);
            }
        }
        protected virtual string GetThumbLocalPath(string thumbFileName)
        {
            var thumbsDirectoryPath = _fileProvider.GetAbsolutePath(MediaConfigDefault.ImageThumbsLocalPath);
            var thumbFilePath = _fileProvider.Combine(thumbsDirectoryPath, thumbFileName);
            return thumbFilePath;
        }
        public virtual string GetPictureUrl(int pictureId,
            int targetSize = 0,
            bool showDefaultPicture = true,
            PictureType defaultPictureType = PictureType.Entity)
        {
            var picture = GetPictureById(pictureId);
            return GetPictureUrl(picture, targetSize, showDefaultPicture, defaultPictureType);
        }
        public string GetPictureUrl(Picture picture, int targetSize = 0, bool showDefaultPicture = true, PictureType defaultPictureType = PictureType.Entity)
        {
            if (picture == null)
                return showDefaultPicture ? GetDefaultPictureUrl(targetSize, defaultPictureType) : string.Empty;

            byte[] pictureBinary = null;
            if (picture.IsNew)
            {
                DeletePictureThumbs(picture);
                pictureBinary = LoadPictureBinary(picture);

                if ((pictureBinary?.Length ?? 0) == 0)
                    return showDefaultPicture ? GetDefaultPictureUrl(targetSize, defaultPictureType) : string.Empty;

                //we do not validate picture binary here to ensure that no exception ("Parameter is not valid") will be thrown
                picture = UpdatePicture(picture.Id,
                    pictureBinary,
                    picture.MimeType,
                    picture.OriginalFileName,
                    picture.AltAttribute,
                    picture.TitleAttribute,
                    false,
                    false);
            }

            var orginalFileName = picture.OriginalFileName; 

            var lastPart = GetFileExtensionFromMimeType(picture.MimeType);
            string thumbFileName;
            if (targetSize == 0)
            {
                thumbFileName = !string.IsNullOrEmpty(orginalFileName)
                    ? $"{picture.Id:0000000}_{orginalFileName}.{lastPart}"
                    : $"{picture.Id:0000000}.{lastPart}";
            }
            else
            {
                thumbFileName = !string.IsNullOrEmpty(orginalFileName)
                    ? $"{picture.Id:0000000}_{orginalFileName}_{targetSize}.{lastPart}"
                    : $"{picture.Id:0000000}_{targetSize}.{lastPart}";
            }

            var thumbFilePath = GetThumbLocalPath(thumbFileName);

            //the named mutex helps to avoid creating the same files in different threads,
            //and does not decrease performance significantly, because the code is blocked only for the specific file.
            using (var mutex = new Mutex(false, thumbFileName))
            {
                if (GeneratedThumbExists(thumbFilePath, thumbFileName))
                    return GetThumbUrl(thumbFileName);

                mutex.WaitOne();

                //check, if the file was created, while we were waiting for the release of the mutex.
                if (!GeneratedThumbExists(thumbFilePath, thumbFileName))
                {
                    pictureBinary = pictureBinary ?? LoadPictureBinary(picture);

                    if ((pictureBinary?.Length ?? 0) == 0)
                        return showDefaultPicture ? GetDefaultPictureUrl(targetSize, defaultPictureType) : string.Empty;

                    byte[] pictureBinaryResized;
                    if (targetSize != 0)
                    {
                        //resizing required
                        using (var image = Image.Load(pictureBinary, out var imageFormat))
                        {
                            image.Mutate(imageProcess => imageProcess.Resize(new ResizeOptions
                            {
                                Mode = ResizeMode.Max,
                                Size = CalculateDimensions(image.Size(), targetSize)
                            }));

                            pictureBinaryResized = EncodeImage(image, imageFormat);
                        }
                    }
                    else
                    {
                        //create a copy of pictureBinary
                        pictureBinaryResized = pictureBinary.ToArray();
                    }

                    SaveThumb(thumbFilePath, thumbFileName, picture.MimeType, pictureBinaryResized);
                }

                mutex.ReleaseMutex();
            }

            return GetThumbUrl(thumbFileName);
        }
        protected virtual byte[] LoadPictureBinary(Picture picture)
        {
            if (picture == null)
                throw new ArgumentNullException(nameof(picture));

            var result = picture.PictureBinary?.BinaryData ?? new byte[0];

            return result;
        }
        public string GetDefaultPictureUrl(int targetSize = 0, PictureType defaultPictureType = PictureType.Entity)
        {
            string defaultImageFileName;
            switch (defaultPictureType)
            {
                case PictureType.Avatar:
                    defaultImageFileName = MediaConfigDefault.DefaultAvatarFileName;
                    break;
                case PictureType.Entity:
                default:
                    defaultImageFileName = MediaConfigDefault.DefaultEntityFileName;
                    break;
            }
            var filePath = GetPictureLocalPath(defaultImageFileName);
            if (!_fileProvider.FileExists(filePath))
            {
                return string.Empty;
            }

            if (targetSize == 0)
            {
                var url = GetImagesPathUrl() + defaultImageFileName;

                return url;
            }
            else
            {
                var fileExtension = _fileProvider.GetFileExtension(filePath);
                var thumbFileName = $"{_fileProvider.GetFileNameWithoutExtension(filePath)}_{targetSize}{fileExtension}";
                var thumbFilePath = GetThumbLocalPath(thumbFileName);
                if (!GeneratedThumbExists(thumbFilePath, thumbFileName))
                {
                    using (var image = Image.Load(filePath, out var imageFormat))
                    {
                        image.Mutate(imageProcess => imageProcess.Resize(new ResizeOptions
                        {
                            Mode = ResizeMode.Max,
                            Size = CalculateDimensions(image.Size(), targetSize)
                        }));
                        var pictureBinary = EncodeImage(image, imageFormat);
                        SaveThumb(thumbFilePath, thumbFileName, imageFormat.DefaultMimeType, pictureBinary);
                    }
                }

                var url = GetThumbUrl(thumbFileName);
                return url;
            }
        }
        protected virtual string GetPictureLocalPath(string fileName)
        {
            return _fileProvider.GetAbsolutePath("images", fileName);
        }
        protected virtual string GetImagesPathUrl()
        {
            var pathBase = _httpContextAccessor.HttpContext.Request.PathBase.Value ?? string.Empty;

            var imagesPathUrl = $"{pathBase}/";


            imagesPathUrl += MediaConfigDefault.ImageFolderName + "/";

            return imagesPathUrl;
        }
        protected virtual bool GeneratedThumbExists(string thumbFilePath, string thumbFileName)
        {
            return _fileProvider.FileExists(thumbFilePath);
        }
        protected virtual Size CalculateDimensions(Size originalSize, int targetSize,
            ResizeType resizeType = ResizeType.LongestSide, bool ensureSizePositive = true)
        {
            float width, height;

            switch (resizeType)
            {
                case ResizeType.LongestSide:
                    if (originalSize.Height > originalSize.Width)
                    {
                        // portrait
                        width = originalSize.Width * (targetSize / (float)originalSize.Height);
                        height = targetSize;
                    }
                    else
                    {
                        // landscape or square
                        width = targetSize;
                        height = originalSize.Height * (targetSize / (float)originalSize.Width);
                    }

                    break;
                case ResizeType.Width:
                    width = targetSize;
                    height = originalSize.Height * (targetSize / (float)originalSize.Width);
                    break;
                case ResizeType.Height:
                    width = originalSize.Width * (targetSize / (float)originalSize.Height);
                    height = targetSize;
                    break;
                default:
                    throw new Exception("Not supported ResizeType");
            }

            if (!ensureSizePositive)
                return new Size((int)Math.Round(width), (int)Math.Round(height));

            if (width < 1)
                width = 1;
            if (height < 1)
                height = 1;

            //we invoke Math.Round to ensure that no white background is rendered - https://www.nopcommerce.com/boards/t/40616/image-resizing-bug.aspx
            return new Size((int)Math.Round(width), (int)Math.Round(height));
        }
        protected virtual void SaveThumb(string thumbFilePath, string thumbFileName, string mimeType, byte[] binary)
        {
            //ensure \thumb directory exists
            var thumbsDirectoryPath = _fileProvider.GetAbsolutePath(MediaConfigDefault.ImageThumbsLocalPath);
            _fileProvider.CreateDirectory(thumbsDirectoryPath);

            //save
            _fileProvider.WriteAllBytes(thumbFilePath, binary);
        }
        protected virtual string GetThumbUrl(string thumbFileName)
        {
            var url = GetImagesPathUrl() + MediaConfigDefault.ImageThumbsFolderName + "/";
            
            url = url + thumbFileName;
            return url;
        }
        #endregion


    }
}

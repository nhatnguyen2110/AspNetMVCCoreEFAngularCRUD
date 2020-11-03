using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Common
{
    public static partial class MediaConfigDefault
    {
        public static int MaximumImageSize => 1980;
        public static int DefaultImageQuality => 80;
        public static string ImageFolderName => @"images";
        public static string ImageThumbsFolderName => @"thumbs";
        public static string ImageThumbsLocalPath => ImageFolderName + @"\" + ImageThumbsFolderName;
        public static string DefaultAvatarFileName => "default-img-avatar.png";
        public static string DefaultEntityFileName => "default-img-entity.png";


    }
}

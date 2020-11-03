using System;
using System.Collections.Generic;
using System.Text;
namespace SunApp.Core.Entities.Media
{
    public partial class PictureBinary : BasicEntity
    {
        /// <summary>
        /// Gets or sets the picture binary
        /// </summary>
        public byte[] BinaryData { get; set; }

        /// <summary>
        /// Gets or sets the picture identifier
        /// </summary>
        public int PictureId { get; set; }

        /// <summary>
        /// Gets or sets the picture
        /// </summary>
        public virtual Picture Picture { get; set; }
    }
}

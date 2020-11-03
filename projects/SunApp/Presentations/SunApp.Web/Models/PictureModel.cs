using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SunApp.Web.Models
{
    public class PictureModel
    {
        [UIHint("Picture")]
        public int Id { get; set; }
    }
}

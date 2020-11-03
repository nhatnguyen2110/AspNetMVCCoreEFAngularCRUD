using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunApp.Web.Models
{
    public class PasswordChangeModel
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}

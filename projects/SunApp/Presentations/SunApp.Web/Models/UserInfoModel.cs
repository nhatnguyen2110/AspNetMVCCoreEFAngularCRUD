using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunApp.Web.Models
{
    public class UserInfoModel
    {
        public UserInfoModel()
        {
            PasswordFormatTypes = new List<SelectListItem>();
        }
        public int Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }
        public bool IsSystemAccount { get; set; }
        public DateTime CreatedOnUtc { get; set; }
        public string Password { get; set; }
        public int PasswordFormatId { get; set; }
        public IEnumerable<SelectListItem> PasswordFormatTypes { get; set; }
        public int PictureId { get; set; }
        public string ImageUrl { get; set; }
    }
}

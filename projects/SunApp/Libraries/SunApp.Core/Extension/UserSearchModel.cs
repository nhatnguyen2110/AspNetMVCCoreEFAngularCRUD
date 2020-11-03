using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Core.Extension
{
    public class UserSearchModel : SearchModel
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
        public bool? Active { get; set; }
        public bool? IsSystemAccount { get; set; }
        
    }
}

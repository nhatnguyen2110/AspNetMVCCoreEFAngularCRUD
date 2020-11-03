using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Core.Entities.Users
{
    public class UserInfo : BasicEntity
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }
        public bool Deleted { get; set; }
        public bool IsSystemAccount { get; set; }
        public DateTime CreatedOnUtc { get; set; }

        public int FailedLoginAttempts { get; set; }
        public DateTime? CannotLoginUntilDateUtc { get; set; }
        public int PictureId { get; set; }

    }
}

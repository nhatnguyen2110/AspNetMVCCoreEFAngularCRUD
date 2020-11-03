using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Core.Entities.Users
{
    public class UserPassword : BasicEntity
    {
        public UserPassword()
        {
            PasswordFormat = PasswordFormat.Clear;
        }
        public int UserId { get; set; }
        public int PasswordFormatId { get; set; }
        public string Password { get; set; }
        public string PasswordSalt { get; set; }
        public DateTime CreatedOnUtc { get; set; }
        public virtual UserInfo UserInfo { get; set; }
        public PasswordFormat PasswordFormat
        {
            get => (PasswordFormat)PasswordFormatId;
            set => PasswordFormatId = (int)value;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Common
{
    public static partial class Constants
    {
        public static string EncryptionKey => "yt5UdqPD7WGYWovVsh5JoaT9iPf5CLdL";//over 16 chars
        public static string DefaultHashedPasswordFormat => "SHA512";
        public static int PasswordSaltKeySize => 5;
        public static int FailedPasswordAllowedAttempts => 0;
        public static int FailedPasswordLockoutMinutes => 5;
        public static string SecretKey => "tXTnmyYgkicOraBrADpTUizj8vryG8Q5";
    }
    
}

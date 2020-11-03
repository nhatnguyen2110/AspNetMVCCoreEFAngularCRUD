using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Core.Entities.Users
{
    public enum UserLoginResults
    {
        /// <summary>
        /// Login successful
        /// </summary>
        Successful = 1,

        /// <summary>
        /// Account does not exist
        /// </summary>
        NotExist = 2,

        /// <summary>
        /// Wrong password
        /// </summary>
        WrongPassword = 3,

        /// <summary>
        /// Account have not been activated
        /// </summary>
        NotActive = 4,

        /// <summary>
        /// Account has been deleted 
        /// </summary>
        Deleted = 5,

        /// <summary>
        /// Account not registered 
        /// </summary>
        NotRegistered = 6,

        /// <summary>
        /// Locked out
        /// </summary>
        LockedOut = 7
    }
}

using SunApp.Common;
using SunApp.Core;
using SunApp.Core.Entities.Users;
using SunApp.Core.Extension;
using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Service.Users
{
    public partial interface IUserService
    {
        UserInfo GetUserInfoById(int id);
        void InsertUserInfo(UserInfo userInfo);
        void UpdateUserInfo(UserInfo userInfo);
        void DeleteUserInfo(UserInfo userInfo);
        IPagedList<UserInfo> GetAllUserInfos(UserSearchModel userSearchModel);
        void InsertUserPassword(UserPassword userPassword);
        void UpdateUserPassword(UserPassword userPassword);
        IList<UserPassword> GetCustomerPasswords(int? userId = null,
            PasswordFormat? passwordFormat = null, int? passwordsToReturn = null);
        UserLoginResults ValidateUserLogin(string username, string password, string hashedPasswordFormat = null,bool skipUpdateFailedLoginAttempts = false);
        UserInfo GetUserInfoByUsername(string username);
        UserPassword GetCurrentPassword(int userId);
        void PreparePassword(UserPassword userPassword, string newPassword, PasswordFormat passwordFormat, string hashedPasswordFormat = null);
    }
}

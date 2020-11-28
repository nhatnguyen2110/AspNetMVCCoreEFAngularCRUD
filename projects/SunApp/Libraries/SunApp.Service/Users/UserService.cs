using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using SunApp.Core;
using SunApp.Core.Data;
using SunApp.Core.Entities.Users;
using SunApp.Core.Extension;
using System.Linq.Dynamic.Core;
using SunApp.Common;

namespace SunApp.Service.Users
{
    public partial class UserService : IUserService
    {
        #region Fields
        private readonly IRepository<UserInfo> _userInfoRepository;
        private readonly IRepository<UserPassword> _userPasswordRepository;
        #endregion
        #region Ctor
        public UserService(
            IRepository<UserInfo> userInfoRepository,
            IRepository<UserPassword> userPasswordRepository
            )
        {
            _userInfoRepository = userInfoRepository;
            _userPasswordRepository = userPasswordRepository;

        }
        #endregion
        #region Methods
        public void DeleteUserInfo(UserInfo userInfo)
        {
            if (userInfo == null)
                throw new ArgumentNullException(nameof(userInfo));

            if (userInfo.IsSystemAccount)
                throw new Exception($"System customer account ({userInfo.UserName}) could not be deleted");

            userInfo.Deleted = true;
            UpdateUserInfo(userInfo);
        }

        public IPagedList<UserInfo> GetAllUserInfos(UserSearchModel userSearchModel)
        {
            var query = _userInfoRepository.Table;
            if (userSearchModel.CreatedFromUtc.HasValue)
            {
                query = query.Where(x => x.CreatedOnUtc >= userSearchModel.CreatedFromUtc.Value);
            }
            if (userSearchModel.CreatedToUtc.HasValue)
            {
                query = query.Where(x => x.CreatedOnUtc <= userSearchModel.CreatedToUtc.Value);
            }
            if (userSearchModel.Active.HasValue)
            {
                query = query.Where(x => x.Active == userSearchModel.Active.Value);
            }
            if (userSearchModel.IsSystemAccount.HasValue)
            {
                query = query.Where(x => x.IsSystemAccount == userSearchModel.IsSystemAccount.Value);
            }
            query = query.Where(x => !x.Deleted);
            if (!string.IsNullOrWhiteSpace(userSearchModel.UserName))
            {
                query = query.Where(x => x.UserName.Contains(userSearchModel.UserName));
            }
            if (!string.IsNullOrWhiteSpace(userSearchModel.FullName))
            {
                query = query.Where(x => x.FullName.Contains(userSearchModel.FullName));
            }
            if (!string.IsNullOrWhiteSpace(userSearchModel.Email))
            {
                query = query.Where(x => x.Email.Contains(userSearchModel.Email));
            }
            if (!string.IsNullOrWhiteSpace(userSearchModel.KeyWord))
            {
                query = query.Where(x => x.FullName.Contains(userSearchModel.KeyWord)
                //|| x.UserName.Contains(userSearchModel.KeyWord)
                || x.Email.Contains(userSearchModel.KeyWord)
                );
            }
            if (userSearchModel.SortDirAcs.HasValue && !String.IsNullOrEmpty(userSearchModel.SortBy))
            {
                query = query.OrderBy(userSearchModel.SortBy + (!userSearchModel.SortDirAcs.Value ? " descending" : string.Empty));
            }
            else //default sort
            {
                query = query.OrderBy(c => c.UserName);
            }

            var res = new PagedList<UserInfo>(query, userSearchModel.PageIndex, userSearchModel.PageSize, userSearchModel.GetOnlyTotalCount);
            return res;
        }

        public UserPassword GetCurrentPassword(int userId)
        {
            if (userId == 0)
                return null;

            //return the latest password
            return GetCustomerPasswords(userId, passwordsToReturn: 1).FirstOrDefault();
        }

        public IList<UserPassword> GetCustomerPasswords(int? userId = null, PasswordFormat? passwordFormat = null, int? passwordsToReturn = null)
        {
            var query = _userPasswordRepository.Table;
            if (userId.HasValue)
            {
                query = query.Where(x => x.UserId == userId.Value);
            }
            if (passwordFormat.HasValue)
            {
                query = query.Where(x => x.PasswordFormatId == (int)passwordFormat.Value);
            }
            //get the latest passwords
            if (passwordsToReturn.HasValue)
            {
                query = query.OrderByDescending(x => x.CreatedOnUtc).Take(passwordsToReturn.Value);
            }
            return query.ToList();
        }

        public UserInfo GetUserInfoById(int id)
        {
            if (id == 0)
            {
                return null;
            }
            var query = _userInfoRepository.Table.Where(x => x.Id == id);
            var res = query.FirstOrDefault();
            return res;

        }

        public UserInfo GetUserInfoByUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return null;

            var query = from x in _userInfoRepository.Table
                        orderby x.Id
                        where x.UserName == username
                        select x;
            var res = query.FirstOrDefault();
            return res;
        }

        public void InsertUserInfo(UserInfo userInfo)
        {
            if (userInfo == null)
                throw new ArgumentNullException(nameof(userInfo));

            _userInfoRepository.Insert(userInfo);
        }

        public void InsertUserPassword(UserPassword userPassword)
        {
            if (userPassword == null)
                throw new ArgumentNullException(nameof(userPassword));

            _userPasswordRepository.Insert(userPassword);            
        }

        public void UpdateUserInfo(UserInfo userInfo)
        {
            if (userInfo == null)
                throw new ArgumentNullException(nameof(userInfo));

            _userInfoRepository.Update(userInfo);
        }

        public void UpdateUserPassword(UserPassword userPassword)
        {
            if (userPassword == null)
                throw new ArgumentNullException(nameof(userPassword));

            _userPasswordRepository.Update(userPassword);
        }

        public UserLoginResults ValidateUserLogin(string username, string password, string hashedPasswordFormat = null, bool skipUpdateFailedLoginAttempts = false)
        {
            var user = this.GetUserInfoByUsername(username);
            if (user == null)
                return UserLoginResults.NotExist;
            if (user.Deleted)
                return UserLoginResults.Deleted;
            if (!user.Active)
                return UserLoginResults.NotActive;
            if (user.CannotLoginUntilDateUtc.HasValue && user.CannotLoginUntilDateUtc.Value > DateTime.UtcNow)
                return UserLoginResults.LockedOut;
            if (!PasswordsMatch(this.GetCurrentPassword(user.Id), password, hashedPasswordFormat))
            {
                //wrong password
                if (!skipUpdateFailedLoginAttempts)
                {
                    user.FailedLoginAttempts++;
                    if (Constants.FailedPasswordAllowedAttempts > 0 &&
                        user.FailedLoginAttempts >= Constants.FailedPasswordAllowedAttempts)
                    {
                        //lock out
                        user.CannotLoginUntilDateUtc = DateTime.UtcNow.AddMinutes(Constants.FailedPasswordLockoutMinutes);
                        //reset the counter
                        user.FailedLoginAttempts = 0;
                    }

                    this.UpdateUserInfo(user);
                }
              
                return UserLoginResults.WrongPassword;
            }

            //update login details
            if (!skipUpdateFailedLoginAttempts)
            {
                user.FailedLoginAttempts = 0;
                user.CannotLoginUntilDateUtc = null;
                this.UpdateUserInfo(user);
            }  

            return UserLoginResults.Successful;
        }
        public void PreparePassword(UserPassword userPassword, string newPassword, PasswordFormat passwordFormat, string hashedPasswordFormat = null)
        {
            if (userPassword == null || string.IsNullOrEmpty(newPassword))
                return;
            if (String.IsNullOrEmpty(hashedPasswordFormat))
            {
                hashedPasswordFormat = Constants.DefaultHashedPasswordFormat;
            }
            userPassword.PasswordFormat = passwordFormat;
            switch (passwordFormat)
            {
                case PasswordFormat.Clear:
                    userPassword.Password = newPassword;
                    break;
                case PasswordFormat.Hashed:
                    userPassword.PasswordSalt = CommonHelper.CreateSaltKey(Constants.PasswordSaltKeySize);
                    userPassword.Password = CommonHelper.CreatePasswordHash(newPassword, userPassword.PasswordSalt, hashedPasswordFormat);
                    break;
                case PasswordFormat.Encrypted:
                    userPassword.Password = CommonHelper.EncryptText(newPassword);
                    break;
                default:
                    break;
            }

        }
        protected bool PasswordsMatch(UserPassword userPassword, string enteredPassword, string hashedPasswordFormat = null)
        {
            if (userPassword == null || string.IsNullOrEmpty(enteredPassword))
                return false;
            if (String.IsNullOrEmpty(hashedPasswordFormat))
            {
                hashedPasswordFormat = Constants.DefaultHashedPasswordFormat;
            }

            var savedPassword = string.Empty;
            switch (userPassword.PasswordFormat)
            {
                case PasswordFormat.Clear:
                    savedPassword = enteredPassword;
                    break;
                case PasswordFormat.Encrypted:
                    savedPassword = CommonHelper.EncryptText(enteredPassword);
                    break;
                case PasswordFormat.Hashed:
                    savedPassword = CommonHelper.CreatePasswordHash(enteredPassword, userPassword.PasswordSalt, hashedPasswordFormat);
                    break;
            }

            if (userPassword.Password == null)
                return false;

            return userPassword.Password.Equals(savedPassword);
        }
        #endregion
    }
}

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.IdentityModel.Tokens;
using SunApp.Common;
using SunApp.Core;
using SunApp.Core.Entities.Users;
using SunApp.Core.Extension;
using SunApp.Service.Media;
using SunApp.Service.Users;
using SunApp.Web.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SunApp.Web.Controllers
{

    public class UserController : BaseController
    {
        private readonly IUserService _userService;
        private readonly IPictureService _pictureService;
        public UserController(
            IUserService userService,
            IPictureService pictureService
            )
        {
            _userService = userService;
            _pictureService = pictureService;
        }
        [Route("api/user/search")]
        [HttpGet]
        public IEnumerable<UserInfoModel> SearchUser(string keyword)
        {
            keyword = keyword ?? "";
            var userSearchModel = new UserSearchModel()
            {
                KeyWord = keyword,
                PageSize = 10
            };
            var res = _userService.GetAllUserInfos(userSearchModel).Select(x => new UserInfoModel()
            {
                Id = x.Id,
                UserName = x.UserName,
                FullName = x.FullName,
                Email = x.Email,
                Active = x.Active,
                IsSystemAccount = x.IsSystemAccount,
                CreatedOnUtc = x.CreatedOnUtc,
                PictureId = x.PictureId,
                ImageUrl = _pictureService.GetPictureUrl(x.PictureId, targetSize: 50, defaultPictureType: PictureType.Avatar)
            }).ToList();
            return res;
        }
        [Route("api/user/detail/{id}")]
        [HttpGet]
        public UserInfoModel GetUserInfoById(int id)
        {
            var res = _userService.GetUserInfoById(id);
            if (res != null)
            {
                return new UserInfoModel()
                {
                    Id = res.Id,
                    FullName = res.FullName,
                    UserName = res.UserName,
                    Active = res.Active,
                    Email = res.Email,
                    IsSystemAccount = res.IsSystemAccount,
                    CreatedOnUtc = res.CreatedOnUtc,
                    PictureId = res.PictureId,
                    ImageUrl = this.ToFullUrl(_pictureService.GetPictureUrl(res.PictureId, targetSize: 200, defaultPictureType: PictureType.Avatar))
                };
            }
            return null;
        }
        [Route("api/user/new")]
        [HttpGet]
        public UserInfoModel NewUser()
        {
            return new UserInfoModel()
            {
                PasswordFormatTypes = this.GetEnumSelectList<PasswordFormat>()
            };
        }
        
        [Route("api/user/save")]
        [HttpPost]
        public UserInfoModel Save(UserInfoModel user)
        {
            if (user.Id > 0)//edit
            {
                var _dbUser = _userService.GetUserInfoById(user.Id);
                if (_dbUser != null)
                {
                    _dbUser.FullName = user.FullName;
                    _dbUser.UserName = user.UserName;
                    _dbUser.Email = user.Email;
                    _dbUser.Active = user.Active;
                    _dbUser.IsSystemAccount = user.IsSystemAccount;
                    _userService.UpdateUserInfo(_dbUser);
                }
            }
            else//new
            {
                var _newUser = new UserInfo();
                _newUser.FullName = user.FullName;
                _newUser.UserName = user.UserName;
                _newUser.Email = user.Email;
                _newUser.Active = user.Active;
                _newUser.IsSystemAccount = user.IsSystemAccount;
                _newUser.CreatedOnUtc = DateTime.UtcNow;
                _userService.InsertUserInfo(_newUser);
                //insert password
                var _userPassword = new UserPassword();
                _userPassword.UserId = _newUser.Id;
                _userPassword.CreatedOnUtc = DateTime.UtcNow;
                _userService.PreparePassword(_userPassword, user.Password, (PasswordFormat)user.PasswordFormatId);
                _userService.InsertUserPassword(_userPassword);
                user.Id = _newUser.Id;

            }
            return user;
        }
        [Route("api/user/delete/{id}")]
        [HttpPost]
        public void DeleteCustomer(int id)
        {
            var user = _userService.GetUserInfoById(id);
            if (user != null)
            {
                _userService.DeleteUserInfo(user);
            }
        }
        [Route("api/user/changepassword/new/{id}")]
        [HttpGet]
        public PasswordChangeModel NewPasswordChange(int id)
        {
            return new PasswordChangeModel() { UserId = id };
        }
        [Route("api/user/changepassword/save")]
        [HttpPost]
        public ResultModel SavePasswordChange(PasswordChangeModel passwordChange)
        {
            var res = new ResultModel();
            var user = _userService.GetUserInfoById(passwordChange.UserId);
            if (user != null)
            {
                var curPassword = _userService.GetCurrentPassword(passwordChange.UserId);
                var validateLogin = _userService.ValidateUserLogin(
                    username: user.UserName,
                    password: passwordChange.CurrentPassword,
                    skipUpdateFailedLoginAttempts: true);
                if (validateLogin == UserLoginResults.Successful)
                {
                    var newPass = new UserPassword()
                    {
                        UserId = passwordChange.UserId,
                        CreatedOnUtc = DateTime.UtcNow
                    };
                    _userService.PreparePassword(newPass, passwordChange.NewPassword, curPassword.PasswordFormat);
                    _userService.InsertUserPassword(newPass);
                    res.IsSuccess = true;
                    res.Message = "Change Password successfully";
                }
                else
                {
                    res.IsSuccess = false;
                    res.Message = "Wrong the current password";
                }
            }
            else
            {
                res.IsSuccess = false;
                res.Message = "Cannot find the user";
            }

            return res;
        }
        [Route("api/user/checkexistedusername")]
        [HttpGet]
        public bool IsUserNameExisted(string username, int skipUserId)
        {
            var _user = _userService.GetUserInfoByUsername(username);
            if (_user != null)
            {
                return _user.Id != skipUserId;
            }
            else
            {
                return false;
            }
        }
        [Route("api/user/updateavatar")]
        [HttpPost]
        public ResultModel UpdateAvatar(int userid, int pictureid)
        {
            var _user = _userService.GetUserInfoById(userid);
            if (_user != null)
            {
                _user.PictureId = pictureid;
                _userService.UpdateUserInfo(_user);
                return new ResultModel()
                {
                    IsSuccess = true,
                    Message = "Save Avatar successfully"
                };
            }
            else
            {
                return new ResultModel()
                {
                    IsSuccess = false,
                    Message = "Invalid User"
                };
            }
        }
        [Route("api/user/getdata")]
        [HttpPost]
        public IActionResult GetData()
        {
            //Datatable parameter
            var draw = Request.Form["draw"];
            //paging parameter
            var start = Request.Form["start"];
            var length = Request.Form["length"];
            //sorting parameter
            var sortColumn = Request.Form["columns[" + Request.Form["order[0][column]"] + "][name]"];
            var sortColumnDir = Request.Form["order[0][dir]"];
            //filter parameter
            var searchValue = Request.Form["search[value]"];
            var userSearchModel = new UserSearchModel()
            {
                KeyWord = searchValue,
                PageSize = Convert.ToInt32("0" + length),
                PageIndex = Convert.ToInt32("0" + start) / Convert.ToInt32("0" + length),
                SortBy = sortColumn.ToString(),
                SortDirAcs = sortColumnDir.ToString() == "asc"
            };
            var res = _userService.GetAllUserInfos(userSearchModel);
            return Json(new
            {
                draw = draw,
                recordsFiltered = res.TotalCount,
                recordsTotal = res.TotalCount,
                data = res.Select(x => new UserInfoModel()
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    FullName = x.FullName,
                    Email = x.Email,
                    Active = x.Active,
                    IsSystemAccount = x.IsSystemAccount,
                    CreatedOnUtc = x.CreatedOnUtc,
                    PictureId = x.PictureId,
                    ImageUrl = _pictureService.GetPictureUrl(x.PictureId, targetSize: 50, defaultPictureType: PictureType.Avatar)
                }).ToList()
            });
        }
        [Route("api/user/getlist")]
        [HttpGet]
        public IActionResult GetList()
        {
            //paging parameter
            var pageIndex = Request.Query["_page"];
            var length = Request.Query["_limit"];
            //sorting parameter
            var sortColumn = Request.Query["_sort"];
            var sortColumnDir = Request.Query["_order"];
            //filter parameter
            var keyword = Request.Query["_keyword"];
            var userSearchModel = new UserSearchModel()
            {
                KeyWord = keyword,
                PageSize = Convert.ToInt32("0" + length),
                PageIndex = Convert.ToInt32("0" + pageIndex) - 1,
                SortBy = sortColumn.ToString(),
                SortDirAcs = sortColumnDir.ToString().ToLower() == "asc"
            };
            foreach (PropertyInfo property in userSearchModel.GetType().GetProperties())
            {
                var pName = property.Name.ToLower() + "_like";
                if (!String.IsNullOrEmpty(Request.Query[pName]))
                {
                    if (property.PropertyType == typeof(string))
                    {
                        property.SetValue(userSearchModel, Request.Query[pName].ToString());
                    }
                    else if (property.PropertyType == typeof(Boolean?) || property.PropertyType == typeof(Boolean))
                    {
                        property.SetValue(userSearchModel, Convert.ToBoolean(Request.Query[pName]));
                    }

                }
            }
            var res = _userService.GetAllUserInfos(userSearchModel);
            return Json(new
            {

                recordsFiltered = res.TotalCount,
                recordsTotal = res.TotalCount,
                data = res.Select(x => new UserInfoModel()
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    FullName = x.FullName,
                    Email = x.Email,
                    Active = x.Active,
                    IsSystemAccount = x.IsSystemAccount,
                    CreatedOnUtc = x.CreatedOnUtc,
                    PictureId = x.PictureId,
                    ImageUrl = this.ToFullUrl(_pictureService.GetPictureUrl(x.PictureId, targetSize: 50, defaultPictureType: PictureType.Avatar))
                }).ToList()
            });
        }
        [Route("api/authenticate")]
        [HttpPost]
        public IActionResult Authenticate([FromBody] LoginViewModel model)
        {

            var result = _userService.ValidateUserLogin(model.UserName, model.Password);
            var token = string.Empty;
            var message = string.Empty;
            switch (result)
            {
                case UserLoginResults.Successful:
                    var _userInfo = _userService.GetUserInfoByUsername(model.UserName);
                    var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.NameId,_userInfo.Id.ToString()),
                        new Claim(JwtRegisteredClaimNames.Sub, _userInfo.UserName),
                        new Claim(JwtRegisteredClaimNames.GivenName, _userInfo.FullName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Website, this.ToFullUrl(_pictureService.GetPictureUrl(_userInfo.PictureId,targetSize:50))),
                        new Claim(JwtRegisteredClaimNames.Email, _userInfo.Email)
                    };
                    //create token
                    var expireToken = DateTime.UtcNow.AddMinutes(Constants.DefaultMinutesExpireToken);
                    if (model.RememberMe)
                    {
                        expireToken = DateTime.UtcNow.AddMinutes(Constants.MinutesExpireTokenInRememberMe);
                    }
                    var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.SecretKey));
                    var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);
                    var jwtSecurityToken = new JwtSecurityToken(
                        issuer: HttpContext.Request.PathBase.Value,
                        audience: HttpContext.Request.PathBase.Value,
                        expires: expireToken,
                        signingCredentials: signingCredentials,
                        claims: claims
                        );
                    
                    return Ok(new
                    {
                        Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
                        Expiration = jwtSecurityToken.ValidTo,
                        Claims = jwtSecurityToken.Claims
                    });

                case UserLoginResults.NotExist:
                    return Unauthorized("Invalid UserName");
                case UserLoginResults.WrongPassword:
                    return Unauthorized("Invalid Password");
                case UserLoginResults.NotActive:
                    return Unauthorized("Your Account is not activated.");
                case UserLoginResults.Deleted:
                    return Unauthorized("Invalid Account");
                case UserLoginResults.NotRegistered:
                    return Unauthorized("Invalid Account");
                case UserLoginResults.LockedOut:
                    return Unauthorized("Your Account is locked");
                default:
                    return BadRequest("Unkonwn Error");
            }

        }

    }
}

using Moq;
using NUnit.Framework;
using SunApp.Core.Data;
using SunApp.Core.Entities.Users;
using SunApp.Service.Users;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using SunApp.Core;
using SunApp.Tests;

namespace SunApp.Service.Tests.Users
{
    [TestFixture]
    public class UserServiceTests
    {
        private UserService _userService;
        private Mock<IRepository<UserInfo>> _userInfoRepo;
        private Mock<IRepository<UserPassword>> _userPasswordRepo;

        [SetUp]
        public new void SetUp()
        {
            _userInfoRepo = new Mock<IRepository<UserInfo>>();
            _userPasswordRepo = new Mock<IRepository<UserPassword>>();

            //initial users
            var user1 = new UserInfo()
            {
                Id=1,
                UserName = "a@b.com",
                Active = true
            };
            var user2 = new UserInfo()
            {
                Id = 2,
                UserName = "test@test.com",
                Active = true
            };
            var user3 = new UserInfo()
            {
                Id = 3,
                UserName = "user@test.com",
                Active = true
            };
            var user4 = new UserInfo()
            {
                Id = 4,
                UserName = "inactive@test.com",
                Active = false
            };
            var user5 = new UserInfo()
            {
                Id = 5,
                UserName = "deleted@test.com",
                Active = true,
                Deleted = true
            };
            _userInfoRepo.Setup(x => x.Table).Returns(new List<UserInfo> { user1, user2, user3, user4, user5 }.AsQueryable());

            //initial Passwords
            var saltkey = CommonHelper.CreateSaltKey(5);
            var password = CommonHelper.CreatePasswordHash("password", saltkey, "SHA512");
            var password1 = new UserPassword()
            {
                UserId = user1.Id,
                PasswordFormat = PasswordFormat.Clear,
                Password = "password",
                CreatedOnUtc = DateTime.UtcNow
            };
            var password2 = new UserPassword()
            {
                UserId = user2.Id,
                PasswordFormat = PasswordFormat.Encrypted,
                Password = CommonHelper.EncryptText("password"),
                CreatedOnUtc = DateTime.UtcNow
            };
            var password3 = new UserPassword()
            {
                UserId = user3.Id,
                PasswordFormat = PasswordFormat.Hashed,
                Password = password,
                PasswordSalt = saltkey,
                CreatedOnUtc = DateTime.UtcNow
            };
            var password4 = new UserPassword()
            {
                UserId = user4.Id,
                PasswordFormat = PasswordFormat.Clear,
                Password = "password",
                CreatedOnUtc = DateTime.UtcNow
            };
            var password5 = new UserPassword()
            {
                UserId = user5.Id,
                PasswordFormat = PasswordFormat.Clear,
                Password = "password",
                CreatedOnUtc = DateTime.UtcNow
            };
            _userPasswordRepo.Setup(x => x.Table).Returns(new[] { password1, password2, password3, password4, password5 }.AsQueryable());
            _userService = new UserService(_userInfoRepo.Object, _userPasswordRepo.Object);
        }

        [Test]
        public void Ensure_only_active_users_can_login()
        {
            var result = _userService.ValidateUserLogin("a@b.com", "password");
            result.ShouldEqual(UserLoginResults.Successful);

            result = _userService.ValidateUserLogin("inactive@test.com", "password");
            result.ShouldEqual(UserLoginResults.NotActive);
        }
        [Test]
        public void Can_validate_a_hashed_password()
        {
            var result = _userService.ValidateUserLogin("user@test.com", "password");
            result.ShouldEqual(UserLoginResults.Successful);
        }
        [Test]
        public void Can_validate_a_clear_password()
        {
            var result = _userService.ValidateUserLogin("test@test.com", "password");
            result.ShouldEqual(UserLoginResults.Successful);
        }

        [Test]
        public void Can_validate_an_encrypted_password()
        {
            var result = _userService.ValidateUserLogin("user@test.com", "password");
            result.ShouldEqual(UserLoginResults.Successful);
        }
        [Test]
        public void Update_method_will_be_called_when_delete_user()
        {
            _userService.DeleteUserInfo(new UserInfo());
            _userInfoRepo.Verify(x => x.Update(It.IsAny<UserInfo>()),Times.Once);
        }
    }
}

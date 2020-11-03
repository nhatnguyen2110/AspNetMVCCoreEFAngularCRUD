using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SunApp.Core.Entities.Users;
using SunApp.Service.Users;
using SunApp.Web.Models;

namespace SunApp.Web.Controllers
{
    public class HomeController : BaseController
    {       
        private readonly ILogger _logger;
        private readonly IUserService _userService;
        public HomeController(IUserService userService
            , ILogger<HomeController> logger
            )
        {
            _userService = userService;
            _logger = logger;
        }
        public IActionResult Index()
        {
            //var user = new UserInfo()
            //{
            //    UserName = "admin",
            //    FullName = "Administrator",
            //    Active = true,
            //    CreatedOnUtc = DateTime.UtcNow,
            //    IsSystemAccount = true
            //};
            //_userService.InsertUserInfo(user);
            //var test = _userService.GetUserInfoById(1);
            //_logger.LogDebug(DateTime.Now + "This is DEBUG log");
            //_logger.LogInformation(DateTime.Now + "This is INFO log");
            //_logger.LogWarning(DateTime.Now + "This is WARNING log");
            //_logger.LogCritical(DateTime.Now + "This is CRITICAL log");
            //_logger.LogTrace(DateTime.Now + "This is TRACE log");
            //try
            //{
            //ThrowError();
            //}
            // catch (Exception ex)
            //{
            //   _logger.LogError(ex, ex.Message);
            // }
            //return View();

            //return View("Index_AngularJS");

            return View("Index_AngularJS_SBAdmin");

            //return View("Index_AngularJS_CoreUI");
        }
        private object ThrowError()
        {
            throw new InvalidOperationException("This is an unhandled exception");
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

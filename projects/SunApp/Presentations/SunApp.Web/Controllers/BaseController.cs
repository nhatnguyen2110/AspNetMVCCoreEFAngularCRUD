﻿using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using SunApp.Web.Infrastructure;

namespace SunApp.Web.Controllers
{
    [ServiceFilter(typeof(CustomExceptionFilter))]
    public abstract class BaseController : Controller
    {
        protected IEnumerable<SelectListItem> GetEnumSelectList<T>()
        {
            return (Enum.GetValues(typeof(T)).Cast<int>().Select(e => new SelectListItem() { Text = Enum.GetName(typeof(T), e), Value = e.ToString() })).ToList();
        }
        protected string ToFullUrl(string relativeUrl)
        {
            if (!relativeUrl.StartsWith('/'))
            {
                relativeUrl = "/" + relativeUrl;
            }
            return String.Format("{0}://{1}{2}",
                (HttpContext.Request.IsHttps ? "https" : "http"),
                HttpContext.Request.Host,
                relativeUrl
                );
        }
    }
}
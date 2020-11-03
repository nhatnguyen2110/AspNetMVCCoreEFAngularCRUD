using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SunApp.Service.Media;
using SunApp.Web.Models;

namespace SunApp.Web.Controllers
{
    public class PictureController : BaseController
    {
        #region Fields

        private readonly IPictureService _pictureService;

        #endregion
        #region Ctor

        public PictureController(IPictureService pictureService)
        {
            _pictureService = pictureService;
        }

        #endregion
        #region Methods
        [HttpPost]
        [IgnoreAntiforgeryToken()]
        public IActionResult AsyncUpload()
        {
            var httpPostedFile = Request.Form.Files.FirstOrDefault();
            if (httpPostedFile == null)
            {
                return Json(new
                {
                    success = false,
                    message = "No file uploaded"
                });
            }

            const string qqFileNameParameter = "qqfilename";

            var qqFileName = Request.Form.ContainsKey(qqFileNameParameter)
                ? Request.Form[qqFileNameParameter].ToString()
                : string.Empty;

            var picture = _pictureService.InsertPicture(httpPostedFile, qqFileName);

            //when returning JSON the mime-type must be set to text/plain
            //otherwise some browsers will pop-up a "Save As" dialog.
            return Json(new
            {
                success = true,
                pictureId = picture.Id,
                imageUrl = _pictureService.GetPictureUrl(picture, 100)
            });
        }
        [HttpDelete]
        [IgnoreAntiforgeryToken()]
        public IActionResult AsyncDelete()
        {
            var id = int.Parse("0" + Request.Query["pictureId"]);
            var _picture = _pictureService.GetPictureById(id);
            if (_picture!=null)
            {
                _pictureService.DeletePicture(_picture);
            }
            return Json(new
            {
                success = true,
                pictureId = 0,
                imageUrl = _pictureService.GetDefaultPictureUrl(targetSize:200)
            });
        }
        public IActionResult Detail(int id)
        {
            var model = new PictureModel() { Id = id};

            return View(model);
        }
        public IActionResult Upload()
        {
           
            return View();
        }
        #endregion
    }
}
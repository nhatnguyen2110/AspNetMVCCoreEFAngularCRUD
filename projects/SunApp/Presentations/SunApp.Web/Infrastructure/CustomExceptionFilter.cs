using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace SunApp.Web.Infrastructure
{
    public class CustomExceptionFilter : ExceptionFilterAttribute
    {
        private readonly ILogger _logger;

        public CustomExceptionFilter(ILogger<CustomExceptionFilter> logger)
        {
            _logger = logger;
        }
        public override void OnException(ExceptionContext filterContext)
        {
            //Log what you need here, the exception is in Context.Exception
            _logger.LogError(new EventId(0), filterContext.Exception, filterContext.Exception.Message);

            base.OnException(filterContext);
            
        }
    }
}

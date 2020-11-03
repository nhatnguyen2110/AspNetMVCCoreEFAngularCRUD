using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SunApp.Core.Infrastructure;
using SunApp.Web.Extensions;

namespace SunApp.Web.Infrastructure
{
    public class DatabaseStartup : IMyStartup
    {
        public int Order => 10;

        public void Configure(IApplicationBuilder application)
        {
            
        }

        public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            //add object context
            services.AddSunAppObjectContext();

            //add EF services
            services.AddEntityFrameworkSqlServer();
            services.AddEntityFrameworkProxies();
        }
    }
}

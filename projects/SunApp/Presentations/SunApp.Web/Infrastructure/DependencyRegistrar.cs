using Autofac;
using Microsoft.EntityFrameworkCore;
using SunApp.Core.Data;
using SunApp.Core.Infrastructure;
using SunApp.Data;
using SunApp.Service.Media;
using SunApp.Service.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunApp.Web.Infrastructure
{
    public class DependencyRegistrar : IDependencyRegistrar
    {
        public int Order => 0;

        public void Register(ContainerBuilder builder, ITypeFinder typeFinder)
        {
            //file provider
            builder.RegisterType<MyFileProvider>().As<IMyFileProvider>().InstancePerLifetimeScope();
            //data layer
            builder.RegisterType<EfDataProviderManager>().As<IDataProviderManager>().InstancePerDependency();
            builder.Register(context => context.Resolve<IDataProviderManager>().DataProvider).As<IDataProvider>().InstancePerDependency();
            builder.Register(context => new SunAppObjectContext(context.Resolve<DbContextOptions<SunAppObjectContext>>()))
                .As<IDbContext>().InstancePerLifetimeScope();
            //repositories
            builder.RegisterGeneric(typeof(EfRepository<>)).As(typeof(IRepository<>)).InstancePerLifetimeScope();
            //services
            builder.RegisterType<UserService>().As<IUserService>().InstancePerLifetimeScope();
            builder.RegisterType<PictureService>().As<IPictureService>().InstancePerLifetimeScope();
        }
    }
}

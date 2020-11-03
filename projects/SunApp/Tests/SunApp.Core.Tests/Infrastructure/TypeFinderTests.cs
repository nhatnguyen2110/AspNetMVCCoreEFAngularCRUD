using Microsoft.AspNetCore.Hosting;
using Moq;
using NUnit.Framework;
using SunApp.Core.Infrastructure;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using SunApp.Tests;

namespace SunApp.Core.Tests.Infrastructure
{
    [TestFixture]
    public class TypeFinderTests
    {
        [Test]
        public void TypeFinder_Benchmark_Findings()
        {
            var hostingEnvironment = new Mock<IHostingEnvironment>();
            hostingEnvironment.Setup(x => x.ContentRootPath).Returns(System.Reflection.Assembly.GetExecutingAssembly().Location);
            hostingEnvironment.Setup(x => x.WebRootPath).Returns(System.IO.Directory.GetCurrentDirectory());
            CommonHelper.DefaultFileProvider = new MyFileProvider(hostingEnvironment.Object);
            var finder = new AppDomainTypeFinder();
            var type = finder.FindClassesOfType<ISomeInterface>().ToList();
            type.Count.ShouldEqual(1);
            typeof(ISomeInterface).IsAssignableFrom(type.FirstOrDefault()).ShouldBeTrue();
        }
    }
    public interface ISomeInterface
    {
    }

    public class SomeClass : ISomeInterface
    {
    }
}

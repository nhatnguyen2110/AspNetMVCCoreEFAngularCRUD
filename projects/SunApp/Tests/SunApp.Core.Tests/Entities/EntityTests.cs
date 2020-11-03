using NUnit.Framework;
using SunApp.Core.Entities.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Core.Tests.Entities
{
    [TestFixture]
    public class EntityTests
    {
        [Test]
        public void Two_transient_entities_should_not_be_equal()
        {

            var p1 = new UserInfo();
            var p2 = new UserInfo();

            Assert.AreNotEqual(p1, p2, "Different transient entities should not be equal");
        }
        [Test]
        public void Two_references_to_same_transient_entity_should_be_equal()
        {

            var p1 = new UserInfo();
            var p2 = p1;

            Assert.AreEqual(p1, p2, "Two references to the same transient entity should be equal");
        }
        [Test]
        public void Entities_with_same_id_but_different_type_should_not_be_equal()
        {
            var id = 10;
            var p1 = new UserInfo { Id = id };

            var c1 = new UserPassword { Id = id };

            Assert.AreNotEqual(p1, c1, "Entities of different types should not be equal, even if they have the same id");
        }
    }
}

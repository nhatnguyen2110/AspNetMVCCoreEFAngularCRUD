using NUnit.Framework;
using SunApp.Tests;
using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Core.Tests
{
    [TestFixture]
    public class CommonHelperTests
    {
        [Test]
        public void Can_get_typed_value()
        {
            CommonHelper.To<int>("1000").ShouldBe<int>();
            CommonHelper.To<int>("1000").ShouldEqual(1000);
        }
        [Test]
        public void When_the_text_is_a_valid_email_address_then_the_validator_should_pass()
        {
            var email = "testperson@gmail.com";
            var result = CommonHelper.IsValidEmail(email);
            result.ShouldEqual(true);
        }
        [Test]
        public void When_the_text_is_null_then_the_validator_should_fail()
        {
            string email = null;
            var result = CommonHelper.IsValidEmail(email);
            result.ShouldEqual(false);
        }

        [Test]
        public void When_the_text_is_empty_then_the_validator_should_fail()
        {
            var email = string.Empty;
            var result = CommonHelper.IsValidEmail(email);
            result.ShouldEqual(false);
        }
        [Test]
        public void When_email_address_contains_upper_cases_then_the_validator_should_pass()
        {
            var email = "testperson@gmail.com";
            var result = CommonHelper.IsValidEmail(email);
            result.ShouldEqual(true);

            email = "TestPerson@gmail.com";
            result = CommonHelper.IsValidEmail(email);
            result.ShouldEqual(true);
        }
    }
}

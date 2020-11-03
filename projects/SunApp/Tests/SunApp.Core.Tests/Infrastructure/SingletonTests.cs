using NUnit.Framework;
using SunApp.Core.Infrastructure;
using System;
using System.Collections.Generic;

namespace SunApp.Core.Tests.Infrastructure
{
    [TestFixture]
    public class SingletonTests
    {
        [Test]
        public void Singleton_IsNullByDefault()
        {
            var instance = Singleton<SingletonTests>.Instance;
            Assert.That(instance, Is.Null);
        }
        [Test]
        public void Singletons_ShareSame_SingletonsDictionary()
        {
            Singleton<int>.Instance = 1;
            Singleton<double>.Instance = 2.0;

            Assert.That(Singleton<int>.AllSingletons, Is.SameAs(Singleton<double>.AllSingletons));
            Assert.That(BaseSingleton.AllSingletons[typeof(int)], Is.EqualTo(1));
            Assert.That(BaseSingleton.AllSingletons[typeof(double)], Is.EqualTo(2.0));
        }
        [Test]
        public void SingletonDictionary_IsCreatedByDefault()
        {
            var instance = SingletonDictionary<SingletonTests, object>.Instance;
            Assert.That(instance, Is.Not.Null);
        }
        [Test]
        public void SingletonDictionary_CanStoreStuff()
        {
            var instance = SingletonDictionary<Type, SingletonTests>.Instance;
            instance[typeof(SingletonTests)] = this;
            Assert.That(instance[typeof(SingletonTests)], Is.SameAs(this));
        }
        [Test]
        public void SingletonList_IsCreatedByDefault()
        {
            var instance = SingletonList<SingletonTests>.Instance;
            Assert.That(instance, Is.Not.Null);
        }
        [Test]
        public void SingletonList_CanStoreItems()
        {
            var instance = SingletonList<SingletonTests>.Instance;
            instance.Insert(0, this);
            Assert.That(instance[0], Is.SameAs(this));
        }
    }

    /// <summary>
    /// Provides a singleton dictionary for a certain key and vlaue type.
    /// </summary>
    /// <typeparam name="TKey">The type of key.</typeparam>
    /// <typeparam name="TValue">The type of value.</typeparam>
    public class SingletonDictionary<TKey, TValue> : Singleton<IDictionary<TKey, TValue>>
    {
        static SingletonDictionary()
        {
            Singleton<Dictionary<TKey, TValue>>.Instance = new Dictionary<TKey, TValue>();
        }

        /// <summary>
        /// The singleton instance for the specified type T. Only one instance (at the time) of this dictionary for each type of T.
        /// </summary>
        public new static IDictionary<TKey, TValue> Instance => Singleton<Dictionary<TKey, TValue>>.Instance;
    }
    /// <summary>
    /// Provides a singleton list for a certain type.
    /// </summary>
    /// <typeparam name="T">The type of list to store.</typeparam>
    public class SingletonList<T> : Singleton<IList<T>>
    {
        static SingletonList()
        {
            Singleton<IList<T>>.Instance = new List<T>();
        }

        /// <summary>
        /// The singleton instance for the specified type T. Only one instance (at the time) of this list for each type of T.
        /// </summary>
        public new static IList<T> Instance => Singleton<IList<T>>.Instance;
    }
}

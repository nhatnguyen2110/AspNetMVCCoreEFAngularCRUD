using SunApp.Core.Data;
using System;

namespace SunApp.Data
{
    /// <summary>
    /// Represents the Entity Framework data provider manager
    /// </summary>
    public partial class EfDataProviderManager : IDataProviderManager
    {
        #region Properties

        /// <summary>
        /// Gets data provider
        /// </summary>
        public IDataProvider DataProvider
        {
            get
            {
                var providerName = DataSettingsManager.LoadSettings()?.DataProvider;
                switch (providerName)
                {
                    case DataProviderType.SqlServer:
                        return new SqlServerDataProvider();

                    //case "sqlce":
                    //    return new SqlCeDataProvider();

                    default:
                        throw new Exception($"Not supported data provider name: '{providerName}'");
                }
            }
        }

        #endregion
    }
}

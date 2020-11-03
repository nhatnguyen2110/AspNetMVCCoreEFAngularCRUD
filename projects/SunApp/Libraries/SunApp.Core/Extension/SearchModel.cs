using System;
using System.Collections.Generic;
using System.Text;

namespace SunApp.Core.Extension
{
    public class SearchModel
    {
        public SearchModel()
        {
            PageIndex = 0;
            PageSize = int.MaxValue;
            GetOnlyTotalCount = false;
            SortDirAcs = true;
        }
        public string KeyWord { get; set; }
        public DateTime? CreatedFromUtc { get; set; }
        public DateTime? CreatedToUtc { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public bool? SortDirAcs { get; set; }
        public bool GetOnlyTotalCount { get; set; }

    }
}

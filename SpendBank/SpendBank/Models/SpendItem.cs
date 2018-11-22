using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpendBank.Models
{
    public class SpendItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string Tags { get; set; }
        public string Uploaded { get; set; }
        public string Spent { get; set; }
        public string Date { get; set; }
    }
}

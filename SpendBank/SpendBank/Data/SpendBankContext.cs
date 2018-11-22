using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SpendBank.Models
{
    public class SpendBankContext : DbContext
    {
        public SpendBankContext (DbContextOptions<SpendBankContext> options)
            : base(options)
        {
        }

        public DbSet<SpendBank.Models.SpendItem> SpendItem { get; set; }
    }
}

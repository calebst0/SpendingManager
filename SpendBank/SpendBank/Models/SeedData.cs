using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace SpendBank.Models
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new SpendBankContext(
                serviceProvider.GetRequiredService<DbContextOptions<SpendBankContext>>()))
            {
                // Look for any movies.
                if (context.SpendItem.Count() > 0)
                {
                    return;   // DB has been seeded
                }

                context.SpendItem.AddRange(
                    new SpendItem
                    {
                        Title = "Is Mayo an Instrument?",
                        Url = "https://i.kym-cdn.com/photos/images/original/001/371/723/be6.jpg",
                        Tags = "spongebob",
                        Uploaded = "07-10-18 4:20T18:25:43.511Z",
                        Spent = "768",
                        Date = "01/01/2000"
                    }
                );
                context.SaveChanges();
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendBank.Models;

namespace SpendBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpendController : ControllerBase
    {
        private readonly SpendBankContext _context;

        public SpendController(SpendBankContext context)
        {
            _context = context;
        }

        // GET: api/Spend
        [HttpGet]
        public IEnumerable<SpendItem> GetSpendItem()
        {
            return _context.SpendItem;
        }

        // GET: api/Spend/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpendItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var spendItem = await _context.SpendItem.FindAsync(id);

            if (spendItem == null)
            {
                return NotFound();
            }

            return Ok(spendItem);
        }

        // PUT: api/Spend/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpendItem([FromRoute] int id, [FromBody] SpendItem spendItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != spendItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(spendItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpendItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Spend
        [HttpPost]
        public async Task<IActionResult> PostSpendItem([FromBody] SpendItem spendItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.SpendItem.Add(spendItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSpendItem", new { id = spendItem.Id }, spendItem);
        }

        // DELETE: api/Spend/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpendItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var spendItem = await _context.SpendItem.FindAsync(id);
            if (spendItem == null)
            {
                return NotFound();
            }

            _context.SpendItem.Remove(spendItem);
            await _context.SaveChangesAsync();

            return Ok(spendItem);
        }

        private bool SpendItemExists(int id)
        {
            return _context.SpendItem.Any(e => e.Id == id);
        }

        // GET: api/Meme/Tags

        [HttpGet]
        [Route("tag")]
        public async Task<List<SpendItem>> GetTagsItem([FromQuery] string tags)
        {
            var spends = from m in _context.SpendItem
                         select m; //get all the memes


            if (!String.IsNullOrEmpty(tags)) //make sure user gave a tag to search
            {
                spends = spends.Where(s => s.Tags.ToLower().Equals(tags.ToLower())); // find the entries with the search tag and reassign
            }

            var returned = await spends.ToListAsync(); //return the memes

            return returned;
        }
    }
}
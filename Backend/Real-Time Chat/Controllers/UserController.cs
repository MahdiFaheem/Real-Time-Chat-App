using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Time_Chat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Real_Time_Chat.Controllers
{
    /// <summary>
    /// Controller for user with specified api routing.
    /// </summary>
    [Route("api/users"),ApiController]
    public class UserController : Controller
    {
        private readonly AppDbContext _db;
        /*
         *  Constructor calling for User controller.
         */
        public UserController(AppDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Get list of all users
        /// </summary>
        /// <returns>Json object of all users</returns>
        [Authorize]
        public async Task<IActionResult> Index()
        {
            return Json(await _db.Users.ToListAsync());
        }

        /// <summary>
        /// Get current user by email
        /// </summary>
        /// <param name="email">Email address of user</param>
        /// <returns>Json object of current user</returns>
        [Route("{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            return Json(await _db.Users.Where(u=>u.Email==email).FirstOrDefaultAsync());
        }

        /// <summary>
        /// Register a user
        /// </summary>
        /// <param name="user">User Details</param>
        /// <returns>Json object of current registered user if registration is successful otherwise returns errors</returns>
        [HttpPost]
        public async Task<IActionResult> RegisterUser(User user)
        {
            if (await _db.Users.AnyAsync(u => u.Email.Equals(user.Email)))
            {
                ModelState.AddModelError("Email", "Email Already Exists");
                return BadRequest(ModelState);
            }
            if(ModelState.IsValid)
            {
                _db.Users.Add(user);
                await _db.SaveChangesAsync();
                return Json(user);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
    }
}

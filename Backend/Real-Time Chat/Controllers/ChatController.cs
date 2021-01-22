using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Real_Time_Chat.DataStorage;
using Real_Time_Chat.Hubs;
using Real_Time_Chat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Real_Time_Chat.Controllers
{
    /// <summary>
    /// Controller for chat with specified api routing.
    /// </summary>
    [Route("api/chats"), ApiController]
    public class ChatController : Controller
    {
        private readonly IHubContext<ChatHub> _hub;
        private readonly AppDbContext _db;
         /*
        *  Constructor calling for Chat controller.
        */
        public ChatController(AppDbContext db, IHubContext<ChatHub> hub)
        {
            _db = db;
            _hub = hub;
        }

       /// <summary>
       /// Get all conversations of current user
       /// </summary>
       /// <returns>Json object of conversations of current user.</returns>
        [Authorize, HttpGet]
        public IActionResult Index()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (claim == null)
                return Unauthorized();

            int userId = Convert.ToInt32(claim.Value);

            return Json(DataManager.GetChats(userId));
        }

        /// <summary>
        /// Sending message from current user
        /// </summary>
        /// <param name="chat">Message Details</param>
        /// <returns>Json object of newly created message if sending is successful otherwise returns errors</returns>
        [HttpPost, Authorize]
        public async Task<IActionResult> SendMessage(Chat chat)
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            int userId = Convert.ToInt32(claim.Value);
            if (ModelState.IsValid)
            {
                chat.SenderId = userId;
                chat.SentOn = DateTime.Now;
                _db.Chats.Add(chat);
                await _db.SaveChangesAsync();
                List<string> conns = new List<string>();
                // Generate a list of active connections with sender and receiver
                foreach (var conn in ChatHub.connections)
                {
                    if (conn.Value == chat.SenderId.ToString() || conn.Value == chat.ReceiverId.ToString())
                        conns.Add(conn.Key);
                }
                // send the message to sender and receiver connections
                await _hub.Clients.Clients(conns).SendAsync("getchats", chat);
                return Json(chat);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Delete conversation of current user.
        /// </summary>
        /// <param name="userId">Id of user whose message to delete.</param>
        /// <returns>Json object successfully delete otherwise false</returns>
        [HttpDelete, Route("{userId}"), Authorize]
        public async Task<IActionResult> DeleteConversation(int userId)
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            int currentUserId = Convert.ToInt32(claim.Value);
            var userChatsToDelete= await _db.Chats.Where(c => c.ReceiverId.Equals(currentUserId) || c.SenderId.Equals(currentUserId))
                .Where(c=>c.ReceiverId.Equals(userId)|| c.SenderId.Equals(userId)).ToListAsync();

            if(userChatsToDelete.Count<1)
            {
                return Json(new { success = false, message = "No messages to delete" });
            }

            foreach (var message in userChatsToDelete)
            {
                if(message.DeletedFrom == null)
                {
                    message.DeletedFrom = currentUserId;
                }
                else
                {
                    if (message.DeletedFrom != currentUserId)
                        _db.Chats.Remove(message);
                }
            }

            await _db.SaveChangesAsync();
            return Json(new { success = true, message = "Messages deleted." });
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Real_Time_Chat.Models;
using System.Collections.Generic;
using System.Linq;

namespace Real_Time_Chat.DataStorage
{
    public class DataManager
    {
        public static IEnumerable<Chat> GetChats(int userId)
        {
            AppDbContext _db = new AppDbContext();
            return _db.Chats.Where(c => (c.SenderId == userId || c.ReceiverId == userId) && c.DeletedFrom != userId).ToList();
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Real_Time_Chat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Real_Time_Chat.Hubs
{
    public class ChatHub : Hub
    {
        public static readonly Dictionary<string, string> connections = new Dictionary<string, string>();

        public override Task OnConnectedAsync()
        {
            string uid = Context.GetHttpContext().Request.Query.FirstOrDefault(r => r.Key == "uid").Value;
            // store current userid and connection id pair
            connections.Add(Context.ConnectionId, uid);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            // remove current connection
            connections.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}

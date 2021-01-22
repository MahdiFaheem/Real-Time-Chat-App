using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Real_Time_Chat.Models
{
    /// <summary>
    /// Model for chat with validations.
    /// </summary>
    public class Chat
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SenderId { get; set; }

        [JsonIgnore]
        public virtual User Sender { get; set; }

        [Required]
        public int ReceiverId { get; set; }

        [JsonIgnore]
        public virtual User Receiver { get; set; }

        [Required]
        public string Message { get; set; }
        public int? DeletedFrom { get; set; }
        public DateTime SentOn { get; set; }
    }
}

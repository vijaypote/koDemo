using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatR.Models
{
    public class ChatResponse
    {
        public int ReplyId { get; set; }
        public string Username { get; set; }
        public int MessageId { get; set; }
        public string Reply { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatR.Models
{
    /// <summary>
    /// 
    /// </summary>
    public class ChatMessage
    {
        /// <summary>
        /// MessageId
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int ParentId { get; set; }
        /// <summary>
        /// [0=parent,1=reply,2=innerreply]
        /// </summary>
        public int NestLevel { get; set; }
        /// <summary>
        /// UserId
        /// </summary>
        public string Username { get; set; }
        /// <summary>
        /// Message
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// Create Date Time
        /// </summary>
        public DateTime Timestamp { get; set; }

        public Replies[] Replies;
    }

    /// <summary>
    /// 
    /// </summary>
    public class Replies
    {
        /// <summary>
        /// MessageId
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int ParentId { get; set; }
        /// <summary>
        /// [0=parent,1=reply,2=innerreply]
        /// </summary>
        public int NestLevel { get; set; }
        /// <summary>
        /// UserId
        /// </summary>
        public string Username { get; set; }
        /// <summary>
        /// Message
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// Create Date Time
        /// </summary>
        public DateTime Timestamp { get; set; }

        public Replies[] Replies;
    }
}
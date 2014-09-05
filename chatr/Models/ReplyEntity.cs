using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatR.Models
{
    public class ReplyEntity
    {
        public int ReplyId { get; set; }
        public int ReplyParentId { get; set; }
        public int ReplyNestLevel { get; set; }        
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ChatR.Models;

namespace ChatR.Controllers
{
    public class HomeController : Controller
    {
        private InMemoryRepository _repository;

        public HomeController()
        {
            _repository = InMemoryRepository.GetInstance();
        }
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                ModelState.AddModelError("username", "Username is required");
                return View();
            }
            else
            {
                // if we have an already logged user with the same username, then append a random number to it
                if (_repository.Users.Where(u => u.Username.Equals(username)).ToList().Count > 0)
                {                    
                    username = _repository.GetRandomizedUsername(username);
                }
                                               
                return View("Chat", "_Layout", username);
            }            
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public object Chat(int replyId, int replyParentId, int replyNestLevel)
        {
            //int replyId, int replyParentId, int replyNestLevel - will use this to get the parent id / reply id so that message can be placed in right block

            // will call db here or will generate id here

            ReplyEntity reply = new ReplyEntity();
            reply.ReplyId = replyId;
            reply.ReplyParentId = replyParentId;
            reply.ReplyNestLevel = replyNestLevel;


            return new { URL = reply };

        }
    }
}

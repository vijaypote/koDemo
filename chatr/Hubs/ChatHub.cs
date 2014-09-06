using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using ChatR.Models;
using ChatR.Utilities;
using Microsoft.AspNet.SignalR.Hubs;

namespace ChatR.Hubs
{
    public class ChatHub : Hub
    {
        private InMemoryRepository _repository;

        public ChatHub()
        {
            _repository = InMemoryRepository.GetInstance();
        }

        #region IDisconnect and IConnected event handlers implementation

        /// <summary>
        /// Fired when a client disconnects from the system. The user associated with the client ID gets deleted from the list of currently connected users.
        /// </summary>
        /// <returns></returns>
        public override Task OnDisconnected()
        {
            string userId = _repository.GetUserByConnectionId(Context.ConnectionId);
            if (userId != null)
            {
                ChatUser user = _repository.Users.Where(u => u.Id == userId).FirstOrDefault();
                if (user != null)
                {
                    _repository.Remove(user);
                    return Clients.All.leaves(user.Id, user.Username, DateTime.Now);
                }
            }

            return base.OnDisconnected();
        }

        #endregion

        #region Chat event handlers

        /// <summary>
        /// Fired when a client pushes a message to the server.
        /// </summary>
        /// <param name="message"></param>
        public void Send(ChatMessage message)
        {
            if (!string.IsNullOrEmpty(message.Content))
            {
                //HashSet<string> extractedURLs;
                //// Sanitize input
                //message.Content = HttpUtility.HtmlEncode(message.Content);
                //// Process URLs: Extract any URL and process rich content (e.g. Youtube links)
                
                //message.Content = TextParser.TransformAndExtractUrls(message.Content, out extractedURLs);
                //message.Timestamp = DateTime.Now;

                HashSet<string> extractedURLs;                
                //===========================================================================================
                // parent message
                //===========================================================================================
                if (message.ParentId == 0)
                {
                    message.Id = message.Id;
                    message.ParentId = message.ParentId;
                    message.NestLevel = message.NestLevel;
                    message.Content = HttpUtility.HtmlEncode(message.Content);
                    message.Content = TextParser.TransformAndExtractUrls(message.Content, out extractedURLs);
                    message.Timestamp = DateTime.Now;
                }

                ////===========================================================================================
                //// next message
                ////===========================================================================================
                //if (message.ParentId == 1)
                //{
                //    ChatMessage Chatmessage = new ChatMessage();

                //    Chatmessage.Id = message.Id;
                //    Chatmessage.ParentId = message.ParentId;
                //    Chatmessage.NestLevel = message.NestLevel;
                //    Chatmessage.Content = HttpUtility.HtmlEncode(message.Content);
                //    Chatmessage.Content = TextParser.TransformAndExtractUrls(message.Content, out extractedURLs);
                //    Chatmessage.Timestamp = DateTime.Now;

                //    message.Chatmessage = Chatmessage;
                //}

                ////===========================================================================================
                //// inner message
                ////===========================================================================================
                //if (message.ParentId == 2)
                //{

                //    ChatMessage Chatmessage = new ChatMessage();

                //    Chatmessage.Chatmessage.Id = message.Id;
                //    Chatmessage.Chatmessage.ParentId = message.ParentId;
                //    Chatmessage.Chatmessage.NestLevel = message.NestLevel;
                //    Chatmessage.Chatmessage.Content = HttpUtility.HtmlEncode(message.Content);
                //    Chatmessage.Chatmessage.Content = TextParser.TransformAndExtractUrls(message.Content, out extractedURLs);
                //    Chatmessage.Chatmessage.Timestamp = DateTime.Now;

                //    message.Chatmessage.Chatmessage = Chatmessage;
                //}

                Clients.All.onMessageReceived(message);
            }
        }

        /// <summary>
        /// Fired when a client joins the chat. Here round trip state is available and we can register the user in the list
        /// </summary>
        public void Joined()
        {
            ChatUser user = new ChatUser()
            {
                //Id = Context.ConnectionId,                
                Id = Guid.NewGuid().ToString(),
                Username = Clients.Caller.username
            };
            _repository.Add(user);
            _repository.AddMapping(Context.ConnectionId, user.Id);
            Clients.All.joins(user.Id, Clients.Caller.username, DateTime.Now);
        }

        /// <summary>
        /// Invoked when a client connects. Retrieves the list of all currently connected users
        /// </summary>
        /// <returns></returns>
        public ICollection<ChatUser> GetConnectedUsers()
        {
            return _repository.Users.ToList<ChatUser>();
        }

        #endregion
    }
}
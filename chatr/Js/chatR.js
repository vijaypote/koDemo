
/*
 * Author: Valerio Gheri
 * Date: 22/07/2012
 * Description: ChatR namespace js file and viewmodels declaration
 */

// Namespace
var chatR = {};

// Models

chatR.chatMessage = function (id, parentid, nestlevel, sender, content, dateSent, chatMessageSender) {
    var self = this;
    //alert(parentid);
    self.id = id;
    self.parentId = parentid;
    
    self.chatMessageSender = chatMessageSender;

    self.username = sender;
    self.content = content;
    if (dateSent != null) {
        self.timestamp = dateSent;
    }
    //self.replyId = id;
    //self.replyParentId = parentid;
    //self.replyNestLevel = nestlevel;

    self.newMessage = ko.observable("");
    self.replySent = ko.observable(false);
    self.replyToMessage = function () {

        var msg = { parentId: self.id, username: self.username, content: self.newMessage() };
        self.chatMessageSender(msg);
        //self.replySent(true);
        self.newMessage('');
    }
    self.replies = ko.observableArray([]);

    self.sendMessage = function (newMessage) {

    };

    return self;
}

chatR.user = function (username, userId) {
    var self = this;
    self.username = username;
    self.id = userId;
}

// ViewModels

chatR.chatViewModel = function (usersModel, currentUser, chatMessageSender) {
    var self = this;

    self.chatMessageSender = chatMessageSender;

    self.messages = ko.observableArray([]);
    self.currentUser = currentUser;

    self.parentMessage = ko.observable('');

    self.sendMessage = function () {
        var msg = { parentId: 0, username: self.currentUser.username, content: self.parentMessage() };
        //var msg = new chatR.chatMessage(id, parentid, nestlevel, currentUser.username);
        self.chatMessageSender(msg);
        self.parentMessage('');
    };

    self.addMessage = function (newMessage) {
        if (newMessage.parentId == undefined || newMessage.parentId == 0) {
            self.messages.push(newMessage);//new Date(message.Timestamp)));
        } else {
            self.addReply(newMessage);
        }
    };

    self.addReply = function (newMessage) {

        for (var i = 0; i < self.messages().length; i++) {
            var parentMessage = self.findParentMessage(newMessage.parentId, self.messages()[i]);
            if (parentMessage != null) {
                parentMessage.replies.push(newMessage);
                break;
            } 
        }
    };

    self.findParentMessage = function (parentId, message) {

        console.log(message.replies().length);
        console.log(message);

        if (parentId == message.id) {
            return message;
        }
        else {
            for (var k = 0; k < message.replies().length; k++) {
                //if (parentId == message.replies()[k].id) {
                //    return message.replies()[k]
                //};
                var childMsg = self.findParentMessage(parentId, message.replies()[k]);
                if (childMsg != null) {
                    return childMsg;
                }
            }
        }

        //for (var k = 0; k < message.replies().length; k++) {
        //    console.log(message.replies()[k]);
        //    return self.findParentMessage(parentId, message.replies()[k]);
        //}
        return null;
    };

    self.usersModel = usersModel;

    return self;
}

chatR.connectedUsersViewModel = function () {
    var self = this;
    self.contacts = ko.observableArray();
    self.customRemove = function (userToRemove) {
        var userIdToRemove = userToRemove.id;
        self.contacts.remove(function (item) {
            return item.id === userIdToRemove;
        });
    }
    return self;
}



/*
 * Author: Valerio Gheri
 * Date: 22/07/2012
 * Description: ChatR namespace js file and viewmodels declaration
 */

// Namespace
var chatR = {};

// Models

chatR.chatMessage = function (id, parentid, nestlevel, sender, content, dateSent, replyMessageCallback) {
    var self = this;
    //alert(parentid);
    self.id = id;
    self.parentId = parentid;
    self.nestLevel = nestlevel;
    self.username = sender;
    self.content = content;
    if (dateSent != null) {
        self.timestamp = dateSent;
    }
    self.replyId = id;
    self.replyParentId = parentid;
    self.replyNestLevel = nestlevel;
    self.newMessage = ko.observable("");
    self.replyToMessage = function () {
        replyMessageCallback(self.newMessage(), self.id);
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

chatR.chatViewModel = function () {
    var self = this;
    self.messages = ko.observableArray([]);

    self.parentMessage = ko.observable('');

    self.sendMessage = function (newMessage) {

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

        if (parentId == message.id) {
            return message;
        }
        else {
            for (var i = 0; i < message.replies().length; i++) {
                if (parentId == message.replies()[i].id) {
                    return message.replies()[i]
                } else {
                    return self.findParentMessage(parentId, message.replies()[i]);
                }
            }
        }
        return null;
    };

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
}


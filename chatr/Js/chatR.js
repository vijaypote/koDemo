﻿
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
    self.parentid = parentid;
    self.nestlevel = nestlevel;
    self.username = sender;
    self.content = content;
    if (dateSent != null) {
        self.timestamp = dateSent;
    }
    
    self.newMessage = ko.observable("");
    self.replyToMessage = function() {        
        replyMessageCallback(self.newMessage());
    }
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
    self.messages = ko.observableArray();
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


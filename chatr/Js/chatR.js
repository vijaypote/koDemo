
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
    
    self.replyId = ko.observable("");
    self.replyParentId = ko.observable("");
    self.replyNestLevel = ko.observable("");
    self.newMessage = ko.observable("");
    self.replyToMessage = function () {

        //// get the reply here
        //try {
        //    $.ajax({
        //        type: "POST",
        //        url: "Home/Chat",// sending it to controller
        //        data: ({ replyId: 2, replyParentId: 1, replyNestLevel: 1 }), // will only pass the required data so that it knows for which message it should be hooked
        //        cache: false,
        //        dataType: "text",
        //        success: function (data) {
        //            //alert(data); // data will be returend from the Home controller / Chat method
        //            $("#replyId").val("2");
        //            $("#replyParentId").val("1");
        //            $("#replyNestLevel").val("1");
        //        }
        //    });
        //}
        //catch (e) { }

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


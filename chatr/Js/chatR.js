// Namespace
var chatR = {};

// Models

chatR.chatMessage = function (id, parentid, sender, content, dateSent, chatMessageSender) {
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

    self.newMessage = ko.observable("");
    self.doReply = ko.observable(false);
    self.replyNow = function () {
        self.doReply(true);
        //console.log('Replyt now');
    };

    self.replyToMessage = function () {

        var msg = { parentId: self.id, username: self.username, content: self.newMessage() };
        self.chatMessageSender(msg);
        self.doReply(false);
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

        //console.log(message.replies().length);
        //console.log(message);
        
        if (parentId == message.id) {
            return message;
        }
        else {
            var parentMessage = null;
            for (var k = 0; k < message.replies().length; k++) {
                parentMessage = self.findParentMessage(parentId, message.replies()[k]);
                if (parentMessage != null) {
                    break;
                }
            }
            if (parentMessage != null) {
                return parentMessage;
            }

        }

        //for (var k = 0; k < message.replies().length; k++) {
        //    console.log(message.replies()[k]);
        //    return self.findParentMessage(parentId, message.replies()[k]);
        //}
        return null;
    };


    self.loadMessages = function (message) {
        console.log(message);
        var date = new Date();
        date.setISO8601(message.timestamp);
        self.addMessage(new chatR.chatMessage(message.id, message.parentId, message.username, message.content, date, self.chatMessageSender));
        //recursive loop for replies.
        if (message.replies && message.replies.length > 0) {
            for (var k = 0; k < message.replies.length; k++) {
                self.loadMessages(message.replies[k]);
            }
        }
        return true;
    };

    self.usersModel = usersModel;


   
    
    // get all message count
    //var allMessage = json[0].messages;
    //var allMessageCnt = json[0].messages.length;


    // load data in begining
    var fakeData = '[{"messages": [{"id": 1,"parentId": 0,"username": "vap","content": "Who are you ?","timestamp": "2014-09-12T06:06:41.848Z","newMessage": "","doReply": false,"replies": [{"id": 2,"parentId": 1,"username": "vap","content": "I am Vijay","timestamp": "2014-09-12T06:06:51.591Z","newMessage": "","doReply": false,"replies": [{"id": 7,"parentId": 2,"username": "vap","content": "I am vijay pote","timestamp": "2014-09-12T06:08:20.920Z","newMessage": "","doReply": false,"replies": []}]},{"id": 3,"parentId": 1,"username": "vap","content": "I am Shetty","timestamp": "2014-09-12T06:07:11.836Z","newMessage": "","doReply": false,"replies": [{"id": 8,"parentId": 3,"username": "vap","content": "I am prashant shetty","timestamp": "2014-09-12T06:08:43.543Z","newMessage": "","doReply": false,"replies": []}]},{"id": 4,"parentId": 1,"username": "vap","content": "I am Jayesh","timestamp": "2014-09-12T06:07:32.438Z","newMessage": "","doReply": false,"replies": [{"id": 9,"parentId": 4,"username": "vap","content": "i am jayesh yeragi","timestamp": "2014-09-12T06:08:54.479Z","newMessage": "","doReply": false,"replies": []},{"id": 10,"parentId": 4,"username": "vap","content": "okay got it","timestamp": "2014-09-12T06:09:10.995Z","newMessage": "","doReply": false,"replies": []}]}]},{"id": 5,"parentId": 0,"username": "vap","content": "Where are you ?","timestamp": "2014-09-12T06:07:58.861Z","newMessage": "","doReply": false,"replies": [{"id": 6,"parentId": 5,"username": "vap","content": "I am right here","timestamp": "2014-09-12T06:08:07.020Z","newMessage": "","doReply": false,"replies": []}]}],"currentUser": {"username": "vap"},"parentMessage": "","usersModel": {"contacts": [{"username": "vap","id": "2ce3aa2b-629b-4bc2-bace-ef6931dfc2eb"}]}}]';

    var json = $.parseJSON(fakeData);
    console.log(json);

    var loadCurrentUser = json[0].currentUser;
    self.currentUser = loadCurrentUser;


    //iterate(fakeData);
    $.each(json, function (idx, obj) {
        $.each(obj.messages, function (mIndex, message) {
            //new function added to load the messages
            self.loadMessages(message);
        });
    });


    return self;
}

function iterate(obj) {
    for (var key in obj) { // iterate, `key` is the property key
        var elem = obj[key]; // `obj[key]` is the value

        if (key === "content") { // found "text" property
            alert(elem)
        }

        if (typeof elem === "object") { // is an object (plain object or array),
            // so contains children
            iterate(elem); // call recursively
        }
    }
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


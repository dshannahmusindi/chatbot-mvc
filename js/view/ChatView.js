var ChatView = function (model) {
	this.model = model;
	this.addMessageEvent = new Event(this);
	this.changeTypingEvent = new Event(this);

	this.init();
};

ChatView.prototype = {
	
	init: function () {
		this.createChildren()
			.setupHandlers()
			.enable();
	},

	createChildren: function () {
		this.$container = $('.js-chat');
		this.$chatBody = this.$container.find('.chat__body');
		this.$chatInner = this.$container.find('.chat__inner');
		this.$addMessageButton = this.$container.find('.js-chat__submit');
		this.$messageInput = this.$container.find('.js-chat__input');
		this.$messagesContainer = this.$container.find('.js-chat__messenger');
		this.$typerContainer = this.$container.find('.js-chat__typer');

		this.$message = $('.js-chat__message');

		this.$messageTemplate = $('#chat__message').clone();
		this.$messageTemplateMessage = this.$messageTemplate.find('.js-chat__message');
		this.$messageTemplateBubble = this.$messageTemplate.find('.js-chat__bubble');
		this.$messageTemplateAvatar = this.$messageTemplate.find('.js-chat__avatar');
		this.$messageSelfClass = 'chat__message--right';

		this.$typingTemplate = $('#chat__typing').clone();
		this.$typingTemplateMessage = this.$typingTemplate.find('.js-chat__message');
		this.$typingTemplateBubble = this.$typingTemplate.find('.js-chat__bubble');
		this.$typingTemplateAvatar = this.$typingTemplate.find('.js-chat__avatar');

		return this;
	},

	setupHandlers: function () {
		this.addMessageButtonHandler = this.addMessageButton.bind(this);
		this.handleKeyupsHandler = this.handleKeyups.bind(this);
		this.clearMessageInputHandler = this.clearMessageInput.bind(this);
		this.addMessageHandler = this.show.bind(this);
		this.changeTypingHandler = this.changeTyping.bind(this);
		this.scrollChatHandler = this.scrollChatBody.bind(this);

		return this;
	},

	enable: function () {
		this.$addMessageButton.click(this.addMessageButtonHandler);
		this.$messageInput.keyup(this.handleKeyupsHandler);
		this.model.addMessageEvent.attach(this.addMessageHandler);
		this.model.addMessageEvent.attach(this.scrollChatHandler);
		this.model.changeTypingEvent.attach(this.changeTypingHandler);
		this.model.changeTypingEvent.attach(this.scrollChatHandler);

		return this;
	},

	addMessageButton: function () {
		this.addMessageEvent.notify({
			message: this.$messageInput.val(),
			author: 'self'
		});
	},

	show: function () {
		this.buildMessageList();
		this.buildTypingList();
	},

	buildMessageList: function () {
		var messages = this.model.getMessages();
		var html = '';
		var authorClass = this.$messageSelfClass;
		var authorAvatar = '';

		this.$messagesContainer.html('');

		for (var message in messages) {
			if (messages[message].messageAuthor === 'self') {
				this.$messageTemplateMessage.addClass(authorClass);
			}
			else {
				this.$messageTemplateMessage.removeClass(authorClass);
			}
			this.$messageTemplateAvatar.find('img').attr('src', 'img/' + this.getAvatar(messages[message].messageAuthor));
			this.$messageTemplateBubble.text(messages[message].messageName);
			html += this.$messageTemplate.html();
		}

		this.$messagesContainer.append(html);
	},

	buildTypingList: function () {
		var typing = this.model.getUsers();
		var html = '';
		var authorClass = this.$messageSelfClass;
		var authorAvatar = '';

		this.$typerContainer.html('');
		
		for (var user in typing) {
			if (typing[user].name === 'self') {
				this.$typingTemplateMessage.addClass(authorClass);
			}
			else {
				this.$typingTemplateMessage.removeClass(authorClass);
			}
			if (typing[user].isTyping) {
				this.$typingTemplateMessage.attr('data-author', typing[user].name);
				this.$typingTemplateAvatar.find('img').attr('src', 'img/' + this.getAvatar(typing[user].name));
				html += this.$typingTemplate.html();
			}
			else {
				this.$message.filter('[data-author="' + typing[user].name + '"]').remove();
			}
		}

		this.$typerContainer.html(html);
	},

	getAvatar: function (username) {
		return username === 'self' ? 'avatar2.jpg' : 'avatar.jpg';
	},

	clearMessageInput: function () {
		this.$messageInput.val('');
	},

	handleKeyups: function (event) {
		if (event.keyCode === 13) {
			this.addMessageButton();
			this.clearMessageInput();
		}
		if (this.$messageInput.val() === '') {
			this.changeTypingEvent.notify({
				author: 'self',
				isTyping: false
			});
			return;
		}
		this.changeTypingEvent.notify({
			author: 'self',
			isTyping: true
		});
	},

	changeTyping:  function () {
		this.show();
	},

	scrollChatBody: function () {
		this.$chatBody.animate({
			scrollTop: this.$chatInner.height()
		}, 0);
		console.log('scrolled');
	}

};

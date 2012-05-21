var Game = module.exports = {
	users: [],
	rooms: [],

	hasUser: function(nickname) {
		var users = this.users.filter(function(elem) {
			return (elem === nickname);
		});

		return users.length > 0 ? true : false;
	},

	addUser: function(user) {
		this.users.push(user);
	},

	addRoom: function() {
		this.rooms.push()
	}
}
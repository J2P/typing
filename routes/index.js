var game = require('./game');

exports.index = function(req, res){	
	res.render('index', { title: 'Method Typing', user: req.user });
};

exports.join = function(req, res) {
	var isSuccess = false,
		user = req.user,
		profile = null,
		nickname = user.username;

		if (user.provider === 'facebook') {

			profile = 'https://graph.facebook.com/'+user.username+'/picture?return_ssl_resources=true';
		} else {
			profile = user._json.profile_image_url;
		}
		
	if (nickname && nickname.trim() !== '') {
		if (!game.hasUser(nickname)) {
			game.addUser({
				nickname: nickname,
				profile: profile
			});
			req.session.nickname = nickname;
			isSuccess = true;
		}
	}
		
	res.render('room', {
		title: 'Method Typing',
		isSuccess: isSuccess,
		users: game.users
	})
};
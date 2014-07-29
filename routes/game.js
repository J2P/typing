var express = require('express');
var redis = require('redis');
var router = express.Router();
var client = redis.createClient();

/* GET users listing. */
router.get('/', function(req, res) {
  	var isSuccess = true;
	// var isSuccess = false,
	// 	user = req.user,
	// 	profile = null,
	// 	nickname = user.username;

	// 	if (user.provider === 'facebook') {

	// 		profile = 'https://graph.facebook.com/'+user.username+'/picture?return_ssl_resources=true';
	// 	} else {
	// 		profile = user._json.profile_image_url;
	// 	}

	 
	client.zrange('typing', 0, -1, "WITHSCORES", function (err, replies) {
		var users = [];
		var scores = [];
		var ranks = [];
		var len = 100;
		if (!err) {
			replies.forEach(function(reply, i) {
				if (i % 2 == 0) {
					users.push(reply);
				} else {
					scores.push(reply);
				}
			});

			users.reverse();
			scores.reverse();
			client.quit();

			if (users.length < 100) {
				len = users.length;
			}


			for (var i=0; i <= len; i++) {
				ranks.push(users[i] + '님 ' + scores[i] + '점');
			}

		
			res.render('room', {
				title: 'Method Typing',
				isSuccess: isSuccess,
				ranks: ranks
			});
		}
	});
});

module.exports = router;


/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').TwitterStrategy
  , TWITTER_CONSUMER_KEY = 'UmcrZok4nTmT1ykNA52Q'
  , TWITTER_CONSUMER_SECRET = 'lmcluBB1WdAZT9lOcWPx0QMVCbe5KN5E5ajyxuIj8';

	passport.use(new TwitterStrategy({
			consumerKey: TWITTER_CONSUMER_KEY,
			consumerSecret: TWITTER_CONSUMER_SECRET,
			callbackURL: "http://typing.j2p.kr/auth/twitter/callback"
		},
		function(token, tokenSecret, profile, done) {
			console.log('a');
			done();
		}
	));

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

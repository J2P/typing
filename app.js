
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes');

var app = module.exports = express.createServer();

var passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	TWITTER_CONSUMER_KEY = 'UmcrZok4nTmT1ykNA52Q',
	TWITTER_CONSUMER_SECRET = 'lmcluBB1WdAZT9lOcWPx0QMVCbe5KN5E5ajyxuIj8',
	FACEBOOK_APP_ID = '123999974396667',
	FACEBOOK_APP_SECRET = '15127106c8f5f38137cd8231c05f1d33';

  	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	passport.use(new TwitterStrategy({
			consumerKey: TWITTER_CONSUMER_KEY,
			consumerSecret: TWITTER_CONSUMER_SECRET,
			callbackURL: "http://typing.j2p.kr/auth/twitter/callback",
			userAuthorizationURL: 'https://api.twitter.com/oauth/authorize'
		},
		function(token, tokenSecret, profile, done) {
			process.nextTick(function(){
				done(null, profile);
			});
		}
	));

	passport.use(new FacebookStrategy({
	    clientID: FACEBOOK_APP_ID,
	    clientSecret: FACEBOOK_APP_SECRET,
	    callbackURL: "http://typing.j2p.kr/auth/facebook/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
	    process.nextTick(function () {
	      return done(null, profile);
	    });
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
  app.use(passport.initialize());
  app.use(passport.session());
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

app.get('/auth/twitter', passport.authorize('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/auth/facebook', passport.authorize('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

/**
 * @namespace Typing
 * 
 * @author J2P
 */

var Typing = Typing || {};

Typing.Init = (function(tp, $){
	var speed = 25000,
		level = 1,
		time = null,
		$container = $('#container'),

		left = (function(){
			return $container.offset().left + 20;
		}()),

		width = (function(){
			return $container.width() - 100;
		}());

	/**
	 * @method start
	 */
	var start = function() {
		var $container = $('#container');

		time = setInterval(function(){
			var $newWord = tp.Word.createWord();

			$container.append($newWord);
			
			tp.Word.startAnimate($newWord);
		}, speed / 2);
	};

	/**
	 * @method stop
	 */
	var stop = function() {
		clearInterval(time);
		time = null
	};

	/**
	 * @method setSpeed
	 */
	var setSpeed = function(sp) {
		speed = sp;
	}

	/**
	 * @method getSpeed
	 */
	var getSpeed = function() {
		return speed;
	};

	/**
	 * @private
	 */
	var _setLeft = function() {
		left = $container.offset().left + 20;
	}

	/**
	 * @method getLeft
	 */
	var getLeft = function() {
		return left;
	};

	/**
	 * @private
	 */
	var _setWidth = function() {
		width = $container.width() - 100;
	}

	/**
	 * @method getWidth
	 */
	var getWidth = function() {
		return width;
	};

	$(window).on('resize', function(){
		_setLeft();
		_setWidth();
	});

	return {
		start: start,
		stop: stop,
		getSpeed: getSpeed,
		setSpeed: setSpeed,
		getLeft: getLeft,
		getWidth: getWidth
	}
}(Typing, jQuery));


Typing.Word = (function(tp, $){
	var words = [
			'리오', 
			'아웃사이더', 
			'빡써', 
			'에이제이', 
			'브리즈', 
			'찌우니', 
			'오디스', 
			'파이어준', 
			'욱사마', 
			'제이투피', 
			'보이', 
			'대니', 
			'팔루트', 
			'나나파크',
			'리오', 
			'아웃사이더', 
			'빡써', 
			'에이제이', 
			'브리즈', 
			'찌우니', 
			'오디스', 
			'파이어준', 
			'욱사마', 
			'제이투피', 
			'보이', 
			'대니', 
			'팔루트', 
			'나나파크'
		];

	/**
	 * @method createStyle
	 */
	var createStyle = function() {
		var random = Math.floor(Math.random() * 7),
			wordStyle = ['', '-primary', '-info', '-success', '-warning', '-danger', '-inverse'];

		return wordStyle[random];
	};

	/**
	 * @method createWord
	 */
	var createWord = function() {
		var $container = $('#container'),
			$left = tp.Init.getLeft(),
			$width = tp.Init.getWidth(),
			$position = Math.floor( (Math.random() * ($width - $left)) + $left ),

			$newWord = $('<span>', {
				text: words[Math.floor(Math.random() * words.length)],
				class: 'btn btn'+this.createStyle()
			}).css({
				'position': 'absolute',
				'top': '0',
				'left': $position
			});

		return $newWord
	};

	/**
	 * @method startAnimate
	 */
	var startAnimate = function($newWord) {
		$newWord.animate({
			'top': '+=672'
		}, tp.Init.getSpeed(), function(){
			$newWord.fadeOut().remove();
		});
	};

	var stopAnimate = function() {

	};

	return {
		createStyle: createStyle,
		createWord: createWord,
		startAnimate: startAnimate,
		stopAnimate: stopAnimate
	}
}(Typing, jQuery));
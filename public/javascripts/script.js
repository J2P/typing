/**
 * @namespace Typing
 * 
 * @author J2P
 */

var Typing = Typing || {};

/**
 * @namespace Typing
 * @class Init
 * @require jQuery
 *
 * @author J2P
 */
Typing.Init = (function(tp, $){
	var speed = 10000,
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
	 * @method setSpeed
	 * @param {Number} sp
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

	/**
	 * @private
	 */
	var _resetProgress = function() {
		var $progress = $('.bar');

		$progress.animate({'width': '100%'}, 'fast');
	};

	/**
	 * @method start
	 */
	var start = function() {
		var $container = $('#container');

		_resetProgress();

		time = setInterval(function(){
			var $newWord = tp.Word.create();

			$container.append($newWord);
			
			tp.Word.startAnimate($newWord);
		}, speed / 2);
	};

	/**
	 * @method stop
	 */
	var stop = function() {
		clearInterval(time);
		time = null;

		$('span.btn').stop().remove();

		$('#closeModal').modal({'backdrop': 'static'});
	};

	/**
	 * @method miss
	 */
	var miss = function() {
		var bar = parseInt($('.bar')[0].style.width);
		var out =  bar - 10;

		$('.bar').animate({'width': out+'%'}, 'fast');

		if (out == 0) {
			tp.Init.stop();
		}
	};

	$('#closeModal').on({
		'click': function(event) {
			event.preventDefault();
			$('#closeModal').modal('hide');
			tp.Init.start();
		}
	}, '.btn');

	$('#wordBox').on({
		'keypress': function(e) {
			if (e.keyCode == '13') {
				var $wordBox = $(this);
				var $text = $wordBox.val();

				if ($wordBox.val() == '') {
					return false;
				}

				tp.Word.find($wordBox, $text);

				return false;
			}
		}
	});

	$(window).on('resize', function(){
		_setLeft();
		_setWidth();
	});

	return {
		start: start,
		stop: stop,
		miss: miss,
		getSpeed: getSpeed,
		setSpeed: setSpeed,
		getLeft: getLeft,
		getWidth: getWidth
	}
}(Typing, jQuery));

/**
 * @namespace Typing
 * @class Word
 * @require jQuery
 *
 * @author J2P
 */

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
		],
		$container = $('#container');

	/**
	 * @method createStyle
	 */
	var style = function() {
		var random = Math.floor(Math.random() * 7),
			wordStyle = ['', '-info', '-success', '-warning', '-danger', '-inverse'];

		return wordStyle[random];
	};

	/**
	 * @method createWord
	 */
	var create = function() {
		var $container = $('#container'),
			$left = tp.Init.getLeft(),
			$width = tp.Init.getWidth(),
			$position = Math.floor( (Math.random() * ($width - $left)) + $left ),

			$newWord = $('<span>', {
				'text': words[Math.floor(Math.random() * words.length)],
				'class': 'btn btn'+this.style()
			}).css({
				'position': 'absolute',
				'top': '0',
				'left': $position
			});

		return $newWord
	};

	/**
	 * @method startAnimate
	 * @param {Elment} $newWord new span Element
	 */
	var startAnimate = function($newWord) {
		$newWord.animate({
			'top': '+=672'
		}, tp.Init.getSpeed(), function(){
			$newWord.fadeOut(1000, function(){
				$(this).remove();
				tp.Init.miss();
			});
		});
	};

	var find = function($wordBox, $text) {
		var $words = $('.btn', $container);
		var find = false;

		$words.each(function(i){
			if($(this).text() == $text) {
				find = true;

				/*$(this).stop().fadeOut(500, function(){
					$(this).remove();
				});*/

				var $btn = $(this);
				var $style = 'badge-'+$btn.attr('class').replace(/btn-?\s?/g, '').replace('danger', 'error');

				$('span.badge').addClass($style).fadeIn('fast', function(){
					$btn.stop();
				}).animate({
					'left' : parseInt($(this).css('left'), 10) + ($btn.width() / 2),
					'top': parseInt($(this).css('top'), 10) + $btn.height()
				}, function() {
					$btn.fadeOut(500, function(){
						$(this).remove();
					});

					$(this).fadeOut(200, function(){
						$(this).css({
							'left': '480px',
							'top': '680px'
						}).removeClass($style);
					});
				});
			}
		});

		if (!find) {
			tp.Init.miss();
		}

		$wordBox.val('');
	};

	return {
		style: style,
		create: create,
		startAnimate: startAnimate,
		find: find
	}
}(Typing, jQuery));
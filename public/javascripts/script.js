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
		myscore = 0,
		time = null,
		timer = null,
		$container = $('#container'),
		$wordWrap = $('.wordWrap');

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
	 * @method setLevel
	 */
	var setLevel = function() {
		++level;
	}

	/**
	 * @method getLevel
	 */
	var getLevel = function() {
		return level;
	}

	/**
	 * @method setScore
	 * @param {Number} point
	 */
	var setScore = function(point) {
		myscore += parseInt(point);

		_changeScore();
	};

	/**
	 * @method getScore
	 */
	var getScore = function() {
		return myscore;
	}

	var _changeScore = function() {
		var $score = $('#score');

		$score.text(getScore());
	}

	/**
	 * @private
	 */
	var _resetProgress = function() {
		var $progress = $('.bar');

		$progress.text('100').css('width', '100%');
		_startTimer();
	};

	/**
	 * @private
	 */
	 var _resetLevel = function() {
	 	var $level = $('#level');

	 	level = 1;
	 	$level.text(1);
	 }

	/**
	 * @private 
	 */
	var _resetScore = function() {
		var $score = $('#score');

	 	$score.text(0);
	};

	/**
	 * @private
	 */
	var _startTimer = function() {
		var $width = 100;
		var $text = 100;
		timer = setInterval(function() {
			var $progress = $('.bar');

			if ($text > 0) {
				$progress.text(--$text);
			} 

			if ($width > 0) {
				$progress.animate({'width': --$width+'%'}, 'fast');
			}

			if ($text === 0 && $width === 0) {
				tp.Init.stop();
			}
		}, 1000);
	}

	/**
	 * @private
	 */
	var _startGame = function(event) {
		event.preventDefault();

		var $modalBackdrop = $('.modal-backdrop');

		$(this).parents('.modal').modal('hide');

		_resetProgress();
		_resetLevel();
		_resetScore();

		tp.Word.init();

		if (time == null) {
			time = setInterval(function(){
				tp.Word.add(function(){
					if ($('.wordWrap').height() >= 700) {
						tp.Init.stop();
					}
				});
			}, speed/level);
		}
	};

	/**
	 * @private
	 */
	var _enter = function(event) {
		if (event.keyCode == '13') {
			var $wordBox = $(this);
			var $text = $wordBox.val();

			if ($wordBox.val() == '') {
				return false;
			}

			tp.Word.find($wordBox, $text);

			return false;
		}
	};

	/**
	 * @method stop
	 */
	var stop = function() {
		var $wordBox = $('#wordBox');
		clearInterval(time);
		clearInterval(timer);
		time = null;
		timer = null;

		$wordBox.blur();

		$('#scoreView').text(myscore + '점');
		$('#closeModal').modal({'backdrop': 'static'});
	};

	/**
	 * @method restart
	 */
	var restart = function() {
		clearInterval(time);
		time = null;

		tp.Word.init();
	};

	//처음 시작전 모달창
	$('#startModal').modal({'backdrop': 'static'});

	//다시시작
	$('#closeModal').on({'click': _startGame}, '.btn');

	//처음시작
	$('#startModal').on({'click': _startGame}, '.btn-primary');

	//입력상자
	$('#wordBox').on({'keypress': _enter});

	return {
		stop: stop,
		restart: restart,
		getSpeed: getSpeed,
		setSpeed: setSpeed,
		getLevel: getLevel,
		setLevel: setLevel,
		getScore: getScore,
		setScore: setScore
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
	var words = window.words = ['constructor', 'hasOwnProperty', 'isPrototypeof', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'create', 'defineProperty', 'defineProperties', 'getOwnPropertyDescriptor', 'keys', 'getOwnPropertyNames', 'getPrototypeOf', 'preventExtensions', 'isExtensible', 'seal', 'isSealed', 'freeze', 'isFrozen', 'apply', 'bind', 'call', 'isGenerator', 'toString', 'isArray', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice', 'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight', 'charAt', 'charCodeAt', 'concat', 'indexof', 'lastIndexOf', 'localeCompare', 'match', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toString', 'toUpperCase', 'trim', 'trimLeft', 'trimRight', 'valueof', 'exec', 'test', 'getDate', 'getDay', 'getFullYear', 'getHours', 'getmilliseconds', 'getMinutes', 'getMonth', 'getSeconds', 'getTime', 'getTimezoneOffset', 'getUTCDate', 'getUTCDay', 'getUTCFullYear', 'getUTCHours', 'getUTCMilliseconds', 'getUTCMinutes', 'getUTCMonth', 'getUTCSeconds', 'setDate', 'setFullYear', 'getHours', 'setMilliseconds', 'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear', 'setUTCHours', 'setUTCMiliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds', 'toDateString', 'toISOString', 'toJSON', 'toLocaleDatString', 'toLocaleString', 'toLocaleTimeString', 'toTimeString', 'toUTCString'],

		$container = $('#container'),
		$wordWrap = $('.wordWrap');		

	/**
	 * @private
	 * @param {Number} level
	 */
	var _changeLevel = function(level) {
		var getLevel = tp.Init.getLevel;
		var getSpeed = tp.Init.getSpeed;

		tp.Init.setLevel();

		$('#level').text(getLevel());

		tp.Init.setSpeed(getSpeed() - getLevel() * 500);
	};

	/**
	 * @method init
	 */
	var init = function() {
		var len = parseInt(words.length / 7) + 1;
		
		$wordWrap.empty();

		for (var i = 0; i < 6; i++) {
			var rnd = (function(){
				return Math.floor( (Math.random() * ((words.length - 7) - 0 + 1)) + 0 );
			}());
			var sliceWord = words.slice(rnd, parseInt(rnd+7));

			$wordWrap.append('<p>');

			$.each(sliceWord, function(e) {
				$('p', $wordWrap).last().append(_create(sliceWord[e]));
			});
		}

		//순서대로 뿌려주는 방식.
		/*for (var i = 0; i < len; i++) {
			var sliceWord = words.slice(i*7, parseInt((i*7) + 7));
			$wordWrap.append('<p>');

			$.each(sliceWord, function(e) {
				$('p', $wordWrap).last().append(_create(sliceWord[e]));
			});
		}*/
		
	};

	/**
	 * @method add
	 * @param {Function} callback
	 */
	var add = function(callback) {
		var rnd = Math.floor( (Math.random() * ((words.length - 7) - 0 + 1)) + 0 );
		var sliceWord = words.slice(rnd, parseInt(rnd+7));

		$('p', $wordWrap).eq(0).before('<p>');

		for (var i = 0; i < 7; i++) {
			$('p',$wordWrap).eq(0).append(_create(sliceWord[i]));
		}

		callback();
	}

	/**
	 * @method createStyle
	 */
	var style = function() {
		var random = Math.floor(Math.random() * 7),
			wordStyle = ['', '-info', '-success', '-warning', '-danger', '-inverse'];

		return {
			word: wordStyle[random],
			point: random + 1
		}
	};

	/**
	 * @method createWord
	 * @param {String} $word
	 */
	var _create = function($word) {
		var style = tp.Word.style();

		$newWord = $('<span>', {
			'text': $word,
			'class': 'btn btn'+style.word,
			'data-id': $word,
			'data-point': style.point 
		});

		return $newWord
	};

	/**
	 * @method find
	 * @param {Element} $wordBox 
	 * @param {String} $text
	 */
	var find = function($wordBox, $text) {
		var $word = $('.btn[data-id="'+$text+'"]', $container);	

		if ($word.length > 0) {
			var $height = $word.height(),
				$width = parseInt($word.width()/2),
				$style = 'badge-'+$word.attr('class').replace(/btn-?\s?/g, '').replace('danger', 'error');


			//@TODO
			/*$container.append($('<span>', {
				'class': 'badge '+$style
			}).animate({
				top: $top,
				left: $left
			}, 'fast',function(){

			}));*/

			tp.Init.setScore($word.attr('data-point'));

			$word.remove();
		} 

		$wordBox.val('');
	};

	return {
		init: init,
		add: add,
		style: style,
		find: find
	}
}(Typing, jQuery));
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
		myscore = 0,
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
	 * @param {Number} sc
	 */
	var setScore = function(sc) {
		myscore += 10 - sc;
	};

	/**
	 * @method getScore
	 */
	var getScore = function() {
		return myscore;
	}

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

		$('#levelView').text(level + '레벨');
		$('#scoreView').text(myscore + '점');
		$('#closeModal').modal({'backdrop': 'static'});
	};

	var restart = function() {
		clearInterval(time);
		time = null;

		time = setInterval(function(){
			var $newWord = tp.Word.create();

			$container.append($newWord);
			
			tp.Word.startAnimate($newWord);
		}, speed / 2);
	}

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

	$('#startModal').modal({'backdrop': 'static'});

	/**
	 * 다시시작
	 */
	$('#closeModal').on({'click': _startGame}, '.btn');

	/**
	 * 처음시작
	 */
	$('#startModal').on({'click': _startGame}, '.btn-primary');

	/**
	 * 입력상자
	 */
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
		stop: stop,
		restart: restart,
		miss: miss,
		getSpeed: getSpeed,
		setSpeed: setSpeed,
		getLevel: getLevel,
		setLevel: setLevel,
		getScore: getScore,
		setScore: setScore,
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
	var words = 'FRENDS 가 구성된지 언 2년이 되어갑니다. 그동안 발표 형식의 기술 공유를 많이 해왔었고 올해는 서로 모여서 코딩하는 모임을 갖어보고자 시작하였습니다. 그리고 작은 아이디어도 함께 모여 구현을 해보는 그런 행사의 첫 시발점이 되고자 내부의 행사를 마련해서 진행을 해보고 있습니다.오픈 커뮤니티가 아니고 행사 운영에 대한 경험도 없고 시행착오에 대한 리스크를 떠 않고 행사를 키우기에는 부담이 있어 FRENDS 내부적으로 행사를 진행하고 있습니다.내부적인 행사이기는 하지만 해카톤 진행에서 나온 결과는 최대한 오픈할 계획입니다.'.split(' '),
		$container = $('#container'),
		myscore = 0;
		

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
			$newWord.fadeOut(200, function(){
				$(this).remove();
				tp.Init.miss();
			});
		});
	};

	/**
	 * @method find
	 * @param {Element} $wordBox 
	 * @param {String} $text
	 */
	var find = function($wordBox, $text) {
		var $words = $('.btn', $container),
			$score = $('#score');

		var find = false;

		$words.each(function(i){
			if($(this).text() == $text) {
				find = true;

				var $btn = $(this);
				var $style = 'badge-'+$btn.attr('class').replace(/btn-?\s?/g, '').replace('danger', 'error');

				$('#container .badge').addClass($style).fadeIn('fast', function(){
					$btn.stop();
				}).animate({
					'left' : parseInt($(this).css('left'), 10) + ($btn.width() / 2),
					'top': parseInt($(this).css('top'), 10) + $btn.height() + (tp.Init.getLevel() * 3)
				}, function() {
					$btn.fadeOut(500, function(){
						var $topValue = Math.floor(parseInt($(this).css('top'), 10)/70);
						var level  = tp.Init.getLevel();

						$(this).remove();
						tp.Init.setScore($topValue);
						myscore = tp.Init.getScore();
						$score.text(myscore);
						

						if (myscore >= 100 && level === 1) {
							_changeLevel();
							tp.Init.restart();
						} else if (myscore >= 200 && level === 2) {
							_changeLevel();
							tp.Init.restart();
						} else if (myscore >= 300 && level === 3) {
							_changeLevel();
							tp.Init.restart();
						} else if (myscore >= 400 && level === 4) {
							_changeLevel();
							tp.Init.restart();
						} else if (myscore >= 500 && level === 5) {
							tp.Init.stop();	
						}
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
/** @language chinese
 * <p>LTweenLite是比较常用的一个动画库，包含各种缓动效果，使用LTweenLite能够简化动画制作的代码编写工作。</p>
 * @class LTweenLite
 * @constructor
 * @since 1.0.0
 * @public
 */
/** @language english
 * <p>LTweenLite is an extremely fast, lightweight, and flexible animation tool that serves as the foundation Animation Platform.</p>
 * @class LTweenLite
 * @constructor
 * @since 1.0.0
 * @public
 */
/** @language japanese
 * <p>LTweenLiteはアニメーショントゥイーン用ライブラリです。高速・軽量がウリなんです。</p>
 * @class LTweenLite
 * @constructor
 * @since 1.0.0
 * @public
 */
var LTweenLite = (function () {
	function LTweenLiteChild ($target, $duration, $vars) {
		var s = this;
		s.objectIndex = s.objectindex = ++LGlobal.objectIndex;
		s.toNew = [];
		s.init($target, $duration, $vars);
	}
	LTweenLiteChild.prototype = {
		init : function($target, $duration, $vars) {
			var s = this, k = null;
			s.target = $target;
			s.duration = $duration || 0.001;
			s.vars = $vars;
			s.currentTime = (new Date()).getTime() / 1000;
			s.delay = s.vars.delay || 0;
			s.combinedTimeScale = s.vars.timeScale || 1;
			s.active = s.duration == 0 && s.delay == 0;
			s.varsto = {};
			s.varsfrom = {};
			if (typeof(s.vars.ease) != "function") {
				s.vars.ease = LEasing.None.easeIn;
			}
			s.ease = s.vars.ease;
			delete s.vars.ease;
			if (s.vars.onComplete) {
				s.onComplete = s.vars.onComplete;
				delete s.vars.onComplete;
			}
			if (s.vars.onUpdate) {
				s.onUpdate = s.vars.onUpdate;
				delete s.vars.onUpdate;
			}
			if (s.vars.onStart) {
				s.onStart = s.vars.onStart;
				delete s.vars.onStart;
			}
			for (k in s.vars) {
				s.varsto[k] = s.vars[k];
				s.varsfrom[k] = s.target[k];
			}
			s.initTime = s.currentTime;
			s.startTime = s.initTime + s.delay;
		},
		tween : function () {
			var s = this, time = (new Date()).getTime() / 1000, etime, tweentype;
			etime = (time - s.startTime);
			if (etime < 0) {
				return;
			}
			for (tweentype in s.varsto) {
				var v = s.ease(etime, s.varsfrom[tweentype], s.varsto[tweentype] - s.varsfrom[tweentype], s.duration);
				s.target[tweentype] = v;
			}
			if (s.onStart) {
				s.onStart(s.target);
				delete s.onStart;
			}
			if (etime >= s.duration) {
				for (tweentype in s.varsto) {
					s.target[tweentype] = s.varsto[tweentype];
				}
				if (s.onComplete) {
					s.onComplete(s.target);
				}
				return true;
			} else if (s.onUpdate) {
				s.onUpdate(s.target);
			}
			return false;
		},
		to : function ($target, $duration, $vars) {
			var s = this;
			s.toNew.push({target : $target, duration : $duration, vars : $vars});
			return s;
		},
		keep : function () {
			var s = this, t, vs, k;
			if (s.toNew.length > 0) {
				t = s.toNew.shift();
				if (t.vars.loop) {
					s.loop = true;
				}
				if (s.loop) {
					vs = {};
					for (k in t.vars) {
						vs[k] = t.vars[k];
					}
					s.to(t.target, t.duration, vs);
				}
				s.init(t.target, t.duration, t.vars);
				return true;
			}
			return false;
		}
	};
	function LTweenLite () {
		
	}
	LTweenLite.prototype = {
		tweens : [],
		ll_show : null,
		frame : function(){
			var s = this;
			var i, length = s.tweens.length, t;
			for (i = 0; i < length; i++) {
				t = s.tweens[i];
				if (t && t.tween && t.tween()) {
					s.tweens.splice(i, 1);
					i--;
					length = s.tweens.length;
					if (t.keep()) {
						s.add(t);
					}
				}
			}
			if (s.tweens.length == 0) {
				s.ll_show = null;
			}
		},
		/** @language chinese
		 * 允许用户拖动指定的 LSprite。LSprite 将一直保持可拖动，直到通过调用 LSprite.stopDrag() 方法来明确停止。
		 * @method to
		 * @param {int} touchPointID 分配给触摸点的整数(触摸设备)。
		 * @example
		 * 	LInit(1000/50,"legend",800,450,main);
		 * 	function main(){
		 * 		LMultitouch.inputMode = LMultitouchInputMode.TOUCH_POINT;
		 * 		for(var i=0;i<3;i++){
		 * 			var child = new LSprite();
		 * 			child.x = 250*i;
		 * 			child.graphics.drawRect(2,"#ff0000",[0,0,100,100],true,"#ff0000");
		 * 			child.addEventListener(LMouseEvent.MOUSE_DOWN,ondown);
		 * 			child.addEventListener(LMouseEvent.MOUSE_UP,onup);
		 * 			addChild(child);
		 * 		}
		 * 	}
		 * 	function ondown(e){
		 * 		e.clickTarget.startDrag(e.touchPointID);
		 * 	}
		 * 	function onup(e){
		 * 		e.clickTarget.stopDrag();
		 * 	}
		 * @examplelink <p><a href="../../../api/LSprite/startDrag.html" target="_blank">测试链接</a></p>
		 * @public
		 * @since 1.8.9
		 */
		/** @language english
		 * Static method for creating a LTweenLiteChild instance that animates to the specified destination values (from the current values).
		 * @method to
		 * @param {Object} target Target object (or array of objects) whose properties this tween affects.
		 * @param {float} duration Duration in seconds (or frames if useFrames:true is set in the vars parameter).
		 * @param {Object} vars An object defining the end value for each property that should be tweened as well as any special properties like onComplete, ease, etc. For example, to tween mc.x to 100 and mc.y to 200 and then call myFunction, do this: TweenLite.to(mc, 1, {x:100, y:200, onComplete:myFunction});
		 * <p>Typically the vars parameter is used to define ending values for tweening properties of the target (or beginning values for from() tweens) like {left:"100px", top:"200px", opacity:0}, but the following optional special properties serve other purposes:</p>
		 * <table>
		 * <tr><th>Property</th><th>Type</th><th>Explanation</th></tr>
		 * <tr><td>delay</td><td>float</td><td>Amount of delay in seconds (or frames for frames-based tweens) before the tween should begin.</td></tr>
		 * <tr><td>ease</td><td>LEasing</td><td>You can choose from various eases to control the rate of change during the animation, giving it a specific "feel". For example, Elastic.easeOut or Strong.easeInOut. For best performance, use one of the GreenSock eases (Linear, Power0, Power1, Power2, Power3, Power4, Quad, Cubic, Quart, Quint, and Strong, each with their .easeIn, .easeOut, and .easeInOut variants are included in the TweenLite, and you can load EasePack to get extras like Elastic, Back, Bounce, SlowMo, SteppedEase, Circ, Expo, and Sine). For linear animation, use the GreenSock Linear.easeNone ease. You can also define an ease by name (string) like "Strong.easeOut" or reverse style (like jQuery uses) "easeOutStrong". The default is None.easeIn.</td></tr>
		 * <tr><td>onComplete</td><td>Function</td><td>A function that should be called when the tween has completed</td></tr>
		 * <tr><td>onStart</td><td>Function</td><td>A function that should be called when the tween begins (when its time changes from 0 to some other value which can happen more than once if the tween is restarted multiple times).</td></tr>
		 * <tr><td>onUpdate</td><td>Function</td><td>A function that should be called every time the tween updates (on every frame while the tween is active)</td></tr>
		 * </table>
		 * @return {LTweenLiteChild} LTweenLiteChild instance
		 * @example
		 * 	LInit(1000/50,"legend",800,450,main);
		 * 	function main(){
		 * 		LMultitouch.inputMode = LMultitouchInputMode.TOUCH_POINT;
		 * 		for(var i=0;i<3;i++){
		 * 			var child = new LSprite();
		 * 			child.x = 250*i;
		 * 			child.graphics.drawRect(2,"#ff0000",[0,0,100,100],true,"#ff0000");
		 * 			child.addEventListener(LMouseEvent.MOUSE_DOWN,ondown);
		 * 			child.addEventListener(LMouseEvent.MOUSE_UP,onup);
		 * 			addChild(child);
		 * 		}
		 * 	}
		 * 	function ondown(e){
		 * 		e.clickTarget.startDrag(e.touchPointID);
		 * 	}
		 * 	function onup(e){
		 * 		e.clickTarget.stopDrag();
		 * 	}
		 * @examplelink <p><a href="../../../api/LSprite/startDrag.html" target="_blank">Try it »</a></p>
		 * @public
		 * @since 1.8.9
		 */
		/** @language japanese
		 * 指定されたスプライトをユーザーがドラッグできるようにします。LSprite.stopDrag() メソッドを呼び出して明示的に停止する
		 * @method to
		 * @param {int} touchPointID タッチポイントに割り当てる整数です(タッチ対応デバイス)。
		 * @example
		 * 	LInit(1000/50,"legend",800,450,main);
		 * 	function main(){
		 * 		LMultitouch.inputMode = LMultitouchInputMode.TOUCH_POINT;
		 * 		for(var i=0;i<3;i++){
		 * 			var child = new LSprite();
		 * 			child.x = 250*i;
		 * 			child.graphics.drawRect(2,"#ff0000",[0,0,100,100],true,"#ff0000");
		 * 			child.addEventListener(LMouseEvent.MOUSE_DOWN,ondown);
		 * 			child.addEventListener(LMouseEvent.MOUSE_UP,onup);
		 * 			addChild(child);
		 * 		}
		 * 	}
		 * 	function ondown(e){
		 * 		e.clickTarget.startDrag(e.touchPointID);
		 * 	}
		 * 	function onup(e){
		 * 		e.clickTarget.stopDrag();
		 * 	}
		 * @examplelink <p><a href="../../../api/LSprite/startDrag.html" target="_blank">実際のサンプルを見る</a></p>
		 * @public
		 * @since 1.8.9
		 */
		to : function ($target, $duration, $vars) {
			if (!$target) {
				return;
			}
			var s = this;
			var tween = new LTweenLiteChild({}, 0, {});
			s.tweens.push(tween);
			s.ll_show = s.frame;
			tween.to($target, $duration, $vars);
			return tween;
		},
		add : function (tween) {
			this.tweens.push(tween);
		},
		remove : function (tween) {
			var s = this;
			if (typeof tween == UNDEFINED) {
				return;
			}
			for (i = 0, l = s.tweens.length; i < l; i++) {
				if (tween.objectIndex == s.tweens[i].objectIndex) {
					s.tweens.splice(i, 1);
					break;
				}
			}
		},
		removeAll : function () {
			this.tweens.splice(0, this.tweens.length);
		}
	};
	var tween = new LTweenLite();
	LGlobal.childList.push(tween);
	return tween;
})();
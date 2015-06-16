define(["exports", "ui-event", "ui-shared"], function (exports, _uiEvent, _uiShared) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Button = (function () {
    function Button(text, x, y, w, h, action) {
      _classCallCheck(this, Button);

      this.text = text;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.action = action;
    }

    _createClass(Button, [{
      key: "activate",
      value: function activate() {
        (0, _uiEvent.addHandler)(this.x, this.y, this.w, this.h, this.action);
      }
    }, {
      key: "draw",
      value: function draw() {
        if (this.x <= _uiEvent.mousex && _uiEvent.mousex <= this.x + this.w && this.y <= _uiEvent.mousey && _uiEvent.mousey <= this.y + this.h) {
          this.draw_hover();
        } else {
          this.draw_normal();
        }
      }
    }, {
      key: "draw_hover",
      value: function draw_hover() {
        this.draw_background("#FEFF9C", "#000000");
        this.draw_text("#000000");
      }
    }, {
      key: "draw_normal",
      value: function draw_normal() {
        this.draw_background("#9F9F9F", "#000000");
        this.draw_text("#000000");
      }
    }, {
      key: "draw_background",
      value: function draw_background(bgcolor, stroke) {
        _uiShared.context.fillStyle = bgcolor;
        _uiShared.context.strokeStyle = stroke;
        _uiShared.context.rect(this.x, this.y, this.w, this.h);
        _uiShared.context.fill();
        _uiShared.context.stroke();
      }
    }, {
      key: "draw_text",
      value: function draw_text(fgcolor) {
        _uiShared.context.fillStyle = fgcolor;
        _uiShared.context.textAlign = "center";
        _uiShared.context.textBaseline = "middle";
        _uiShared.context.font = "30px sans-serif";
        _uiShared.context.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);
      }
    }]);

    return Button;
  })();

  exports.Button = Button;
});
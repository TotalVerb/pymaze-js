import {mousex, mousey, addHandler} from "ui-event";
import {context} from "ui-shared";

export class Button {
  constructor(text, x, y, w, h, action) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.action = action;
  }

  activate() {
    addHandler(this.x, this.y, this.w, this.h, this.action);
  }

  draw() {
    if (this.x <= mousex && mousex <= this.x + this.w
    && this.y <= mousey && mousey <= this.y + this.h) {
      this.draw_hover();
    } else {
      this.draw_normal();
    }
  }

  draw_hover() {
    this.draw_background('#FEFF9C', '#000000');
    this.draw_text('#000000');
  }

  draw_normal() {
    this.draw_background('#9F9F9F', '#000000');
    this.draw_text('#000000');
  }

  draw_background(bgcolor, stroke) {
    context.fillStyle = bgcolor;
    context.strokeStyle = stroke;
    context.rect(this.x, this.y, this.w, this.h);
    context.fill();
    context.stroke();
  }

  draw_text(fgcolor) {
    context.fillStyle = fgcolor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "30px sans-serif";
    context.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);
  }
}

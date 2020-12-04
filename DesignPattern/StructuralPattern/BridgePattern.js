/**
 * 桥接模式
 * 将抽象化与实现化解耦，使得二者可以独立变化
 * 通过提供抽象化与实现化之间的桥接结构实现解耦
 */
// 桥接API
class DrawAPI {
  drawCricle(radius, x, y) {
    throw new Error("子类请实现接口");
  }
}
class RedCircle extends DrawAPI {
  drawCricle(radius, x, y) {
    console.log(`Drawing red circle. radius: ${radius}, x: ${x}, y: ${y}`);
  }
}
class GreenCircle extends DrawAPI {
  drawCricle(radius, x, y) {
    console.log(`Drawing green circle. radius: ${radius}, x: ${x}, y: ${y}`);
  }
}

// 抽象类 Shape，使用 DrawAPI 进行桥接
class Shape {
  constructor(drawAPI) {
    this.drawAPI = drawAPI;
  }
  draw() {
    throw new Error("子类请实现接口");
  }
}
// Shape 的实体类
class Circle extends Shape {
  constructor(radius, x, y, drawAPI) {
    super(drawAPI);
    this.radius = radius;
    this.x = x;
    this.y = y;
  }
  draw() {
    this.drawAPI.drawCricle(this.radius, this.x, this.y);
  }
}
//test
const redCircle = new Circle(100, 100, 100, new RedCircle());
const greenCircle = new Circle(100, 100, 100, new GreenCircle());
redCircle.draw();
greenCircle.draw();

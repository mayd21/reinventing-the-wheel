class Shape {
  draw() {
    throw new Error("子类请实现接口");
  }
}

class Rectangle extends Shape {
  draw() {
    console.log("draw reactangle");
  }
}
class Square extends Shape {
  draw() {
    console.log("draw square");
  }
}
class Circle extends Shape {
  draw() {
    console.log("draw circle");
  }
}

class Color {
  fill() {
    throw new Error("子类请实现接口");
  }
}

class Red extends Color {
  fill() {
    console.log("fill red");
  }
}
class Green extends Color {
  fill() {
    console.log("fill green");
  }
}
/**
 * 工厂模式
 */
class ShapeFactory {
  getShape(type) {
    switch (type) {
      case "reactangle":
        return new Rectangle();
      case "square":
        return new Square();
      case "circle":
        return new Circle();
      default:
        return null;
    }
  }
}
// test
const shapeFactory = new ShapeFactory();
shapeFactory.getShape("square").draw();

/**
 * 抽象工厂模式
 * 围绕一个超级工厂类创建其他工厂类，再围绕工厂类创建实体类
 */
// 抽象工厂类
class AbstractFactory {
  getColor(color) {
    throw new Error("子类请实现接口");
  }
  getShape(shape) {
    throw new Error("子类请实现接口");
  }
}
class ColorFactory extends AbstractFactory {
  getColor(color) {
    switch (color) {
      case "red":
        return new Red();
      case "green":
        return new Green();
      default:
        return null;
    }
  }
  getShape() {
    return null;
  }
}
class ShapeFactory extends AbstractFactory {
  getShape(shape) {
    switch (shape) {
      case "reactangle":
        return new Rectangle();
      case "square":
        return new Square();
      case "circle":
        return new Circle();
      default:
        return null;
    }
  }
  getColor() {
    return null;
  }
}
class FactoryProducer {
  static getFactory(factory) {
    switch (factory) {
      case "color":
        return new ColorFactory();
      case "shape":
        return new ShapeFactory();
      default:
        return null;
    }
  }
}
// test
const colorFactory = FactoryProducer.getFactory("color");
colorFactory.getColor("red").fill();

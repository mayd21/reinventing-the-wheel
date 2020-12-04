/**
 * 代理模式
 * 一个类代表另一个类的功能，创建一个具有现有对象的对象，以便向外界提供功能接口
 */
// Image 接口
class Image {
  display() {
    throw new Error("子类请实现接口");
  }
}
class RealImage extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.loadFromDisk(filename);
  }
  loadFromDisk(filename) {
    console.log(`Loading ${filename}`);
  }
  display() {
    console.log(`Displaying ${this.filename}`);
  }
}
// 代理对象
// 减少 RealImage 对象加载的内存占用
class ProxyImage extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.realImage = null;
  }
  display() {
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}
// test
const proxyImage = new ProxyImage("test.jpg");
proxyImage.display(); // 第一次图形将从磁盘加载
proxyImage.display(); // 第二次将不再从磁盘加载

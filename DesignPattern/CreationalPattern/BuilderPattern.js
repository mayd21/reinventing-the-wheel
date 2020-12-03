/**
 * 建造者模式
 * 使用多个简单的步骤，逐步构建一个复杂的对象
 * 场景：通过选择不同的食物组合成一个套餐
 */
// 打包形式
class Wrapper {
  pack() {
    return "Wrapper";
  }
}
class Bottle {
  pack() {
    return "Bottle";
  }
}
// 食物抽象类
class Item {
  name() {
    throw new Error("子类请实现接口");
  }
  packing() {
    throw new Error("子类请实现接口");
  }
  price() {
    throw new Error("子类请实现接口");
  }
}
// 汉堡父类
class Burger extends Item {
  packing() {
    return new Wrapper();
  }
}
// 饮料父类
class ColdDrink extends Item {
  packing() {
    return new Bottle();
  }
}

// 汉堡实例
class VegBurger extends Burger {
  price() {
    return 15;
  }
  name() {
    return "Veg Burger";
  }
}
class ChickenBurger extends Burger {
  price() {
    return 25;
  }
  name() {
    return "Chicken Burger";
  }
}
// 饮料实例
class Pepsi extends ColdDrink {
  price() {
    return 5;
  }
  name() {
    return "Pepsi";
  }
}
class Coke extends ColdDrink {
  price() {
    return 5;
  }
  name() {
    return "Coke";
  }
}

// Meal类，带有 Item 对象
class Meal {
  items = [];
  addItem(item) {
    this.items.push(item);
  }
  getCost() {
    let cost = 0;
    this.items.forEach((item) => {
      cost += item.price();
    });
  }
  showItems() {
    this.items.forEach((item) => {
      console.log(
        `Item: ${item.name()}, Packing: ${item
          .packing()
          .pack()}, Price: ${item.price()}`
      );
    });
  }
}
class MealBuilder {
  perpareVegMeal() {
    const meal = new Meal();
    meal.addItem(new VegBurger());
    meal.addItem(new Coke());
    return meal;
  }
  perpareChikenMeal() {
    const meal = new Meal();
    meal.addItem(new ChickenBurger());
    meal.addItem(new Pepsi());
    return meal;
  }
}
// test
const mealBuilder = new MealBuilder();
mealBuilder.perpareChikenMeal().showItems();

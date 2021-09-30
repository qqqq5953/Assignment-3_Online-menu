const App = {
  data() {
    return {
      iceType: ["正常冰", "少冰", "微冰", "去冰", "熱"],
      sugarType: ["全糖", "七分", "半糖", "三分", "無糖"],
      toppingsType: ["珍珠", "粉條", "小粉圓", "椰果", "芋頭"],
      hasDefault: {
        toppings: "toppings",
        sugar: "sugar",
        ice: "ice"
      },
      // cart
      cartIsHidden: true,
      cart: [],
      cartTotalArr: [],
      cartTotal: "" || 0,
      // order
      ordersAreHidden: true,
      orders: "",
      orderTotal: "" || 0,
      orderTime: "",
      orderNumFinal: "" || 0,
      // 遮罩
      isProductChosen: false,
      // 選項切換
      checkboxDefault: false,
      radioDefault: "off",
      // 品項
      drinkInfo: "",
      productChosen: {
        name: "",
        productNotice: "",
        iceType: "",
        sugarType: "",
        toppingsArr: [],
        drinkPrice: "",
        toppingsPrice: "",
        num: "" || 1, // 杯數
        sum: "", // 小計
      },
      products: [
        {
          name: "珍珠鮮奶茶",
          engName: "Pearl Milk Tea",
          price: 60,
          defaults: {
            toppings: ["珍珠"],
            sugar: "",
            ice: ""
          }
        },
        {
          name: "椰果鮮奶茶",
          engName: "Coconut Milk Tea",
          price: 60,
          defaults: {
            toppings: ["椰果"],
            sugar: "",
            ice: ""
          }
        },
        {
          name: "鮮奶茶",
          engName: "Milk Tea",
          price: 50,
          defaults: {
            toppings: [""],
            sugar: "",
            ice: ""
          }
        },
        {
          name: "古意冬瓜茶 (糖固定)",
          engName: "Winter Melon Drink",
          price: 30,
          defaults: {
            toppings: [""],
            sugar: "全糖",
            ice: ""
          }
        },
        {
          name: "蜜香紅茶",
          engName: "Black Tea",
          price: 30,
          defaults: {
            toppings: [""],
            sugar: "",
            ice: ""
          }
        },
        {
          name: "包種青茶",
          engName: "Black Tea",
          price: 35,
          defaults: {
            toppings: [""],
            sugar: "",
            ice: ""
          }
        },
        {
          name: "檸檬烏龍",
          engName: "Lemon Oolong Tea",
          price: 55,
          defaults: {
            toppings: [""],
            sugar: "",
            ice: ""
          }
        },
        {
          name: "薑母茶 (熱飲)",
          engName: "Ginger Tea",
          price: 55,
          defaults: {
            toppings: [""],
            sugar: "",
            ice: "熱"
          }
        },
        {
          name: "青草茶",
          engName: "Herbal Tea",
          price: 35,
          defaults: {
            toppings: [""],
            sugar: "",
            ice: ""
          }
        },
        {
          name: "金桔檸檬",
          engName: "Kumquat Lemonade",
          price: 40,
          defaults: {
            toppings: [""],
            sugar: "",
            ice: ""
          }
        },
        {
          name: "柳澄青茶",
          engName: "Orange Mountain Tea",
          price: 45,
          defaults: {
            toppings: [""],
            sugar: "",
            ice: ""
          }
        }
      ]
    };
  },
  methods: {
    chooseDrink(drink, e) {
      e.preventDefault();
      this.drinkInfo = drink;
      // 將飲料名及價格先存入 productChosen
      this.productChosen.name = drink.name;
      this.productChosen.drinkPrice = drink.price;
      // 打開遮罩
      this.isProductChosen = true;
      // radio turn on
      this.radioDefault = "on";
      // 清空 toppings 陣列
      this.productChosen.toppingsArr = [];
    },
    setDefault(drinkInfo, type, hasDefault) {
      // 點選飲料前防止跳錯
      if (drinkInfo.defaults === undefined) return;

      // hasDefault 為 "ice, sugar 或 toppings" 判斷：
      // 1. 當傳入 "ice, sugar" 時
      if (hasDefault === "ice" || hasDefault === "sugar") {
        // 如果沒預設
        if (drinkInfo.defaults[hasDefault] === "") {
          return false;
        } else {
          // 只有預設的回傳 true，其他回傳false
          return drinkInfo.defaults[hasDefault] !== type;
        }
      } else {
        // 2. 當傳入 "toppings" 時
        // 如果沒預設
        if (drinkInfo.defaults[hasDefault] === "") {
          return false;
        } else {
          // 只有預設的回傳 true，其他回傳false
          return drinkInfo.defaults[hasDefault] == type;
        }
      }
    },
    resetDefault() {
      // 加入購物車或取消後，選項重製
      this.productChosen.num = 1;
      this.radioDefault = "off";
      this.checkboxDefault = false;
      this.productChosen.productNotice = "";
      // 遮罩蓋上
      this.isProductChosen = false;
    },
    addIce(item) {
      this.productChosen.iceType = item;
    },
    addSugar(item) {
      this.productChosen.sugarType = item;
    },
    toppingInputAdjust() {
      this.checkboxDefault = true;
    },
    addToCart(productChosen) {
      this.cartIsHidden = false;
      // 加料的價錢
      productChosen.toppingsPrice = productChosen.toppingsArr.length * 10;
      // 計算小計＝（加料價錢＋單價）*數量
      productChosen.sum = (productChosen.toppingsPrice + productChosen.drinkPrice) * productChosen.num;
      // 計算總金額
      this.cartTotalArr.push(productChosen.sum);
      this.cartTotal = this.cartTotalArr.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });

      // 加入購物車
      this.cart.push({ ...productChosen });
    },

    createOrder(cart) {
      this.cartIsHidden = true;
      this.ordersAreHidden = false,
        this.getOrderTime();
      this.getFinalProductNum();
      this.orderTotal = this.cartTotal;
      this.orders = [...cart];

      // 測試用
      // console.log("cart", this.cart);
      // console.log("orders", this.orders);
      // console.log("cart 修改前", this.cart[0].drinkPrice);
      // console.log("orders 修改前", this.orders[0].drinkPrice);
      // this.orders[0].drinkPrice = 20;
      // console.log("cart 修改後", this.cart[0].drinkPrice); //20
      // console.log("orders 修改後", this.orders[0].drinkPrice);//20
    },
    getOrderTime() {
      let today = new Date();
      this.orderTime = `${today.getFullYear()}-${today.getMonth() + 1
        }-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    },
    getFinalProductNum() {
      let finalNum = 0;
      this.cart.forEach((item) => {
        finalNum = finalNum + parseInt(item.num);
      }); // 原本想用orders迭代而不是cart，但會出現錯誤：this.orders.forEach is not a function，不知道是不是因為orders結構的關係?
      this.orderNumFinal = finalNum;
    }
  }
};

Vue.createApp(App).mount("#app");


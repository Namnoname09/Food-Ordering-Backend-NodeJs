const {
  sequelize,
  Voucher,
  Food,
  Order,
  OrderDetail,
} = require("../models");

const vouchers = [
  { voucherCode: "WELCOME10", discount: 10 },
  { voucherCode: "FOODIE15", discount: 15 },
  { voucherCode: "LUNCH20", discount: 20 },
];

const foods = [
  {
    name: "Phở bò",
    imageUrl: "https://placehold.co/600x400?text=Pho+Bo",
    price: 65000,
    rating: 4.8,
    time: "20-30 phút",
  },
  {
    name: "Bún chả Hà Nội",
    imageUrl: "https://placehold.co/600x400?text=Bun+Cha",
    price: 55000,
    rating: 4.7,
    time: "20-30 phút",
  },
  {
    name: "Cơm tấm sườn bì chả",
    imageUrl: "https://placehold.co/600x400?text=Com+Tam",
    price: 60000,
    rating: 4.8,
    time: "15-25 phút",
  },
  {
    name: "Bánh mì thịt nướng",
    imageUrl: "https://placehold.co/600x400?text=Banh+Mi",
    price: 35000,
    rating: 4.6,
    time: "10-20 phút",
  },
  {
    name: "Gỏi cuốn tôm thịt",
    imageUrl: "https://placehold.co/600x400?text=Goi+Cuon",
    price: 40000,
    rating: 4.5,
    time: "10-20 phút",
  },
  {
    name: "Bún bò Huế",
    imageUrl: "https://placehold.co/600x400?text=Bun+Bo+Hue",
    price: 60000,
    rating: 4.7,
    time: "20-30 phút",
  },
  {
    name: "Mì xào hải sản",
    imageUrl: "https://placehold.co/600x400?text=Mi+Xao",
    price: 70000,
    rating: 4.4,
    time: "20-30 phút",
  },
  {
    name: "Trà đào cam sả",
    imageUrl: "https://placehold.co/600x400?text=Tra+Dao",
    price: 30000,
    rating: 4.6,
    time: "5-10 phút",
  },
];

const orders = [
  {
    orderCode: "FO-20261023-001",
    firstName: "Minh",
    lastName: "Nguyễn",
    email: "minh.nguyen@example.com",
    address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    phone: "0901234567",
    methodPayment: "COD",
    voucherCode: "WELCOME10",
  },
  {
    orderCode: "FO-20261023-002",
    firstName: "Lan",
    lastName: "Trần",
    email: "lan.tran@example.com",
    address: "25 Lê Lợi, Quận Hải Châu, Đà Nẵng",
    phone: "0912345678",
    methodPayment: "Chuyển khoản",
    voucherCode: "FOODIE15",
  },
  {
    orderCode: "FO-20261023-003",
    firstName: "An",
    lastName: "Lê",
    email: "an.le@example.com",
    address: "8 Trần Phú, Quận Hoàn Kiếm, Hà Nội",
    phone: "0987654321",
    methodPayment: "COD",
    voucherCode: null,
  },
];

const orderDetails = [
  {
    orderCode: "FO-20261023-001",
    foodName: "Phở bò",
    quantity: 2,
  },
  {
    orderCode: "FO-20261023-001",
    foodName: "Trà đào cam sả",
    quantity: 2,
  },
  {
    orderCode: "FO-20261023-002",
    foodName: "Bún chả Hà Nội",
    quantity: 1,
  },
  {
    orderCode: "FO-20261023-002",
    foodName: "Gỏi cuốn tôm thịt",
    quantity: 2,
  },
  {
    orderCode: "FO-20261023-003",
    foodName: "Cơm tấm sườn bì chả",
    quantity: 1,
  },
  {
    orderCode: "FO-20261023-003",
    foodName: "Bún bò Huế",
    quantity: 1,
  },
];

const seed = async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  await sequelize.transaction(async (transaction) => {
    const voucherByCode = new Map();
    for (const voucher of vouchers) {
      const [record] = await Voucher.findOrCreate({
        where: { voucherCode: voucher.voucherCode },
        defaults: voucher,
        transaction,
      });
      voucherByCode.set(record.voucherCode, record);
    }

    const foodByName = new Map();
    for (const food of foods) {
      const [record] = await Food.findOrCreate({
        where: { name: food.name },
        defaults: food,
        transaction,
      });
      foodByName.set(record.name, record);
    }

    const orderByCode = new Map();
    for (const { voucherCode, ...order } of orders) {
      const voucher = voucherCode ? voucherByCode.get(voucherCode) : null;
      const [record] = await Order.findOrCreate({
        where: { orderCode: order.orderCode },
        defaults: { ...order, voucherId: voucher?.id ?? null },
        transaction,
      });
      orderByCode.set(record.orderCode, record);
    }

    for (const detail of orderDetails) {
      const order = orderByCode.get(detail.orderCode);
      const food = foodByName.get(detail.foodName);

      if (!order || !food) {
        throw new Error(
          `Không tìm thấy đơn hàng hoặc món ăn cho chi tiết ${detail.orderCode} - ${detail.foodName}`,
        );
      }

      await OrderDetail.findOrCreate({
        where: { orderId: order.id, foodId: food.id },
        defaults: {
          orderId: order.id,
          foodId: food.id,
          quantity: detail.quantity,
        },
        transaction,
      });
    }
  });

  console.log("Đã tạo dữ liệu mẫu cho Voucher, Food, Order và OrderDetail.");
};

seed()
  .catch((error) => {
    console.error("Không thể tạo dữ liệu mẫu:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });

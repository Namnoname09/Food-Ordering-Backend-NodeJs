require('dotenv').config();

const app = require('./app');
const {sequelize} = require('./src/models');

const PORT = Number(process.env.PORT) || 8000;
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Kết nối MySQL thành công")

        await sequelize.sync();
        console.log("Đã đồng bộ các bảng");

        app.listen(PORT, () => {
            console.log(`Server chạy tại http://localhost:${PORT}`)
        })
    } catch(error) {
        console.error("Không thể khởi đọng server:", error.message);
        process.exitCode = 1;
    }
}
startServer();
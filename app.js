require("dotenv").config()
const sequelize=require('./CIIS/config/database')
const Server=require('./server');

async function main(){
    const server = new Server();
    //await sequelize.sync();
    await server.initialize()
    server.listen();
}

main();
const sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

const config = require("../config");

module.exports = {
  init: init,
  getEntity: getEntity,
  instance: null,
  entities: {},
  close: close,
  emptyDatabase: emptyDatabase,
};

const childTables = [];

function init() {
  return new Promise((resolve, reject) => {
    try {
      getSequelizeInstance.bind(this)();
      collectEntities.bind(this)();
      this.instance.sync({ force: false });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function close() {
  return this.instance.close();
}

function getEntity(entityName) {
  if (!this.entities[entityName]) {
    throw new Error(`Entity ${entityName} does not exist.`);
  }
  return this.entities[entityName];
}

function getSequelizeInstance() {
  if (!this.instance) {
    console.log(config.database)
    this.instance = new sequelize(
      config.database.name,
      config.database.username,
      config.database.password,
      {
        dialect: config.database.dialect,

        host: config.database.host,
        port: config.database.port,

        logging: (msg) => console.log(msg),

        dialectOptions: {
          supportBigNumbers: true,
          bigNumberStrings: true,
        },

        omitNull: false,

        define: {
          underscored: false,
          freezeTableName: false,
          charset: "utf8",
          dialectOptions: {
            collate: "utf8_general_ci",
          },
          timestamps: false,
        },

        sync: { force: false },

        pool: {
          max: 5,
          idle: 30000,
          acquire: 60000,
        },

        isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        loqQueryParameters: true,
      }
    );
  }

  return this.instance;
}

function collectEntities() {
  const entities = fs.readdirSync(path.join(__dirname, "entities"));

  // Entities initialization
  for (const entity of entities) {
    const entityName = path.basename(entity, ".js");
    const importedEntity = require(path.join(__dirname, "entities", entity));
    this.entities[entityName] = importedEntity.init(this.instance);
    if (childTables.includes(entityName)) {
      this.entities[entityName].removeAttribute("id");
    }
    console.log(`Defining - ${entityName}`);
  }

  // Entities association
  for (const entity in this.entities) {
    if (typeof this.entities[entity].associate === "function") {
      this.entities[entity].associate(this.entities);
    }
  }
}

async function emptyDatabase() {
  const entities = fs.readdirSync(path.join(__dirname, "entities"));
  for (const entity of entities) {
    const importedEntity = require(path.join(__dirname, "entities", entity));
    entityInstance = importedEntity.init(this.instance);
    try {
      await entityInstance.destroy({
        where: {},
      });
    } catch (e) {
      console.error(`Error deleting entity ${entity}: ${e}`);
    }
  }
}

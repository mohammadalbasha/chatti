import mongoose, { Connection } from "mongoose";
import { getDatabaseConfiguration } from "../modules/common/config/config";

class DB {
  private connection?: Connection;
  static _instance: DB;
  // private constructor to ensure Singleton
  private constructor() {}

  static instance() {
    if (DB._instance) return DB._instance;

    DB._instance = new DB();
    return DB._instance;
  }

  public async initialize() {
    // const url = `mongodb+srv://${
    //   getDatabaseConfiguration().USERNAME
    // }:${encodeURIComponent(
    //   getDatabaseConfiguration().PASSWORD
    // )}@cluster0.op0nt.mongodb.net/?retryWrites=true&w=majority`;
    const url = `mongodb://${getDatabaseConfiguration().USERNAME}:${
      getDatabaseConfiguration().PASSWORD
    }@localhost:27017`;

    await mongoose.connect(url);
    this.connection = mongoose.connection;
  }

  public ready() {
    return this.connection !== null;
  }

  public getConnection() {
    return this.connection;
  }

  public async closeConnection() {
    await mongoose.connection.close();
    this.connection = undefined;
  }
}
export default DB;

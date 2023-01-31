import ContainerDAOFactory from "../daos/DaoFactory.js";

const DAO = ContainerDAOFactory.get("UsersRole");
DAO.init();

export default class RepoUsers {
  async getUserRole(userName) {
    return DAO.getByUserName(userName);
  }

  async createRole(user) {
    return await DAO.save(user);
  }
}

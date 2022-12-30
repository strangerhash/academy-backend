import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import Route from '@interfaces/routes.interface';

class UsersRoute implements Route {
  public path = '/users/';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}index`, this.usersController.getUsers);
    this.router.get(`${this.path}getuserbyId/:id(\\d+)`, this.usersController.getUserById);
    this.router.post(`${this.path}create-user`, this.usersController.createUser);
    this.router.put(`${this.path}update-user/:id(\\d+)`, this.usersController.updateUser);
    this.router.delete(`${this.path}delete/:id(\\d+)`, this.usersController.deleteUser);
  }
}

// validationMiddleware(CreateUserDto, 'body', true)

export default UsersRoute;

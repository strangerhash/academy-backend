import bcrypt, { compare } from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import DB from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import HttpException from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { generateToken } from '@utils/util';
import { response } from 'express';

class AuthService {
  public users = DB.Users;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const body = {
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
      companyName: userData.companyName,
      town: userData.town,
      country: userData.country,
      city: userData.city,
      postalCode: userData.postalCode,
      phoneNumber: userData.phoneNumber,
      roleId: 2,
      firstName: userData.firstName,
      lastName: userData.lastName,
      account_verified: false,
      token: nanoid(140),
      activation_code: nanoid(35),
    };
    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const createUserData: User = await this.users.create(body);
    //send mail 
    var nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      port: 25,
      host: 'localhost',
      tls: {
        rejectUnauthorized: false
      },
    });



    let code = body.activation_code;

    let url = `https://boss.eghamtech.com/api/activate-account?code=${code}`;
    // console.log(url);
    // let url = 

    var message = {
      from: 'noreply@domain.com',
      to: userData.email,
      subject: 'Email Registration',
      text: 'You Have Registered Successfully',
      html: `Dear ${userData.email} <br/>You or someone else has requested to register an account on TheBoss App. <br/>  To confirm your registration, please follow this link:<br/><b><a href=${url} style='color:green;font-weight:bold;'>Activate Account</a></b><br/>If you didn't request it, please ignore this email. Your email will not be active until you access the link above <br/>
      Kind Regards  <br/> TheBoss App Team`,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });

    return createUserData;
  }



  public async activateAccount(code) {
    const findUser: User = await this.users.findOne({ where: { activation_code: code } });
    if (!findUser) {
      return false;
    }
    const updateUser = await this.users.update({ account_verified: true }, { where: { activation_code: code } });
    if (!updateUser) {
      return false;
    }
    const updatedActivationCode = await this.users.update({ activation_code: null }, { where: { activation_code: code } });
    if (!updatedActivationCode) {
      return false;
    }
    return true;
  }

  public async sendMailForForgotPassword(email) {
    const updatedActivationCode = await this.users.update({ activation_code: nanoid(35) }, { where: { email: email } });
    const findUser: User = await this.users.findOne({ where: { email: email } });
    if (!findUser) {
      return false;
    }

    //send mail
    var nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      port: 25,
      host: 'localhost',
      tls: {
        rejectUnauthorized: false
      },
    });
    let activation_code = findUser.activation_code;

    let url = `https://boss.eghamtech.com/change-password?activation-code=${activation_code}`;
    console.log(url);





    var message = {
      from: 'noreply@domain.com',
      to: email,
      subject: 'Change Password Request',
      text: 'You have requested For Password Change',
      html: `Dear ${email} <br/>Here is the text for e-mail for registration and password change
       <br/>  Change my password:<br/><a href=${url} style='color:green;font-weight:bold;'>Change password</a>If you didn't request it, please ignore this email. Your email will not be active until you access the link above <br/>
       Kind Regards  <br/> TheBoss App Team`,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });



    return true;
  }


  public async forgotPassword(activation_code, password) {
    const findUser: User = await this.users.findOne({ where: { activation_code: activation_code } });
    if (!findUser) {
      return false;
    }
    const updatePassword = await this.users.update({ password: await bcrypt.hash(password, 10), }, { where: { activation_code: activation_code } });
    if (!updatePassword) {
      return false;
    }
    const updatedActivationCode = await this.users.update({ activation_code: null }, { where: { activation_code: activation_code } });
    if (!updatedActivationCode) {
      return false;
    }
    return true;
  }


  public async login(userData: any): Promise<{ token: string; user: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    console.log(userData.password);
    if (!findUser) {

      // throw new HttpException(409, `The entered credentials do not match our records!`);
      return {
        token: null, user: null
      };
    }

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'The entered password is not  correct!');

    const token = await this.createToken(findUser);

    return { token, user: findUser };
  }





  public async createAdmin(): Promise<User> {
    const userData = {
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin123', 10),
      companyName: 'Test Company ',
      town: 'Alaska',
      country: 'USA',
      city: 'CAlifornia',
      postalCode: '123456',
      phoneNumber: '+14646464646',
      roleId: 1,
      firstName: 'Admin',
      lastName: 'Admin',
      token: nanoid(140),
      account_verified: true,
      activation_code: nanoid(35)

    };
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);
    const createUserData: User = await this.users.create({ ...userData, password: userData.password });
    return createUserData;
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createToken(user: User): Promise<any> {
    const token = await generateToken(user.id);
    return token;
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;

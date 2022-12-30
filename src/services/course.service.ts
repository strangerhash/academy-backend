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

class CourseService {
  public course = DB.Course;


}

export default CourseService;

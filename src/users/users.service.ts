import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async create(createUserDto: CreateUserDto) {
    // async create(email: string, password: string, name: string) {
    const hashPassword = this.getHashPassword(createUserDto.password)
    let user = await this.userModel.create({
      email: createUserDto.email, password: hashPassword, name: createUserDto.name
    })
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById({
        _id: id
      })
    } catch (error) {
      return "Not found user"
    }
  }

  async findOneByUserName(username: string) {
    return await this.userModel.findOne({
      email: username
    })
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.updateOne({
        _id: updateUserDto._id
      },
        { ...updateUserDto })
    } catch (error) {
      return "Not found user"
    }
  }

  async remove(id: string) {
    try {
      return await this.userModel.deleteOne({
        _id: id
      })
    } catch (error) {
      return "Not found user"
    }
  }
}

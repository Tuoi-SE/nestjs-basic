import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
    ) { }

    // username/pass là 2 tham số thư viện passport trả về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUserName(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password)
            if (isValid === true) {
                return user;
            }
        }
        return null;
    }

    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            role
        };
    }

    getHashPassword(password: string) {
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        return hash;
    }

    async register(registerUserDto: RegisterUserDto) {
        const { email, password } = registerUserDto;
        const checkEmail = await this.userModel.findOne({ email }).exec();
        if (checkEmail) {
            throw new ConflictException('Email already exists');
        }
        const hashPassword = this.getHashPassword(password)
        const newUser = await this.userModel.create({
            name: registerUserDto.name,
            email: registerUserDto.email,
            password: hashPassword,
            age: registerUserDto.age,
            gender: registerUserDto.gender,
            address: registerUserDto.address,
            role: "USER"
        })
        return {
            _id: newUser._id,
            createdAt: newUser['createdAt']
        };
    }
}

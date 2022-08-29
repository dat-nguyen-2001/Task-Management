import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthCredentailDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }

    async signUp(authCredentailDto: AuthCredentailDto): Promise<void> {
        const { username, password } = authCredentailDto;
        const existedUser = await User.find({ where: { username: username } });
        if (existedUser.length) {
            throw new NotAcceptableException("User already existed");
        }
        const user = new User();
        user.salt = await bcrypt.genSalt();
        user.username = username;
        user.password = await this.hashPassword(password, user.salt);
        try {await user.save();}
        catch(err) {
            console.log(err)
        }
        console.log('User Created!')
    }

    async signIn(authCredentailDto: AuthCredentailDto): Promise<void> {
        const { username, password } = authCredentailDto;
        const res = await User.find({ where: {username} });
        if (!res.length) {
            throw new NotFoundException('User not found!')
        }
        const user = res[0]
        if (!(await user.validatePassword(password))) {
            throw new UnauthorizedException('Incorrect Password, please try again!!!')
        }
        console.log('Signed in')
    }
}

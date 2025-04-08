import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({ email, password: hashedPassword, role });
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    // Debug log to check if user exists
    console.log('user from DB:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    console.log('Password from DB:', user.password);
console.log('Password from login form:', password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
      // Debug log to check password match
  console.log('Password valid:', isPasswordValid);
  console.log('Password from DB:', user.password);
console.log('Password from login form:', password);
console.log('Plain password:', password);
console.log('Stored hashed password:', user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return { token, role: user.role };
  }
}
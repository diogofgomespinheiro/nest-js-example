import { EntityRepository, Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await genSalt();
    user.password = await this.hashPassword(password, user.salt);

    await user.save();
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (!user || !user.validatePassword(password)) {
      return null;
    }

    return user.username;
  }

  private async hashPassword(password: string, salt: string) {
    return hash(password, salt);
  }
}

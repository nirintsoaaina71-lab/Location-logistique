import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUsers() {
   
    return this.usersService.getUsers();
  }
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser({ id });
  }
}

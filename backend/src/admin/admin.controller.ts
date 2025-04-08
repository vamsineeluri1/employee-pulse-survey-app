import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('responses')
  findAll() {
    return this.adminService.findAll();
  }

  @Get('export')
  async export(@Query('format') format: 'csv' | 'json' = 'json') {
    return this.adminService.export(format);
  }
}
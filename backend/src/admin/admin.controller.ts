import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
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
  async export(
    @Query('format') format: 'csv' | 'json' = 'json',
    @Res() res: Response,
  ) {
    const data = await this.adminService.export(format);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      return res.send(data);
    }

    res.setHeader('Content-Type', 'application/json');
    return res.json(data);
  }
}
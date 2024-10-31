import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProxyService {
  constructor(private readonly prisma: PrismaService) {}
}

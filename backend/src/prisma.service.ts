// src/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private targetDbUrl: string;

  constructor() {
    const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
    const envPath = path.resolve(process.cwd(), envFile);
    
    // On extrait l'URL en utilisant dotenv directement pour être 100% sûr
    let actualDbUrl = process.env.DATABASE_URL;
    
    try {
      const parsedEnv = dotenv.config({ path: envPath }).parsed;
      if (parsedEnv && parsedEnv.DATABASE_URL) {
        actualDbUrl = parsedEnv.DATABASE_URL;
      }
    } catch (err) {}

    super({
      datasources: {
        db: {
          url: actualDbUrl,
        },
      },
    });
    
    this.targetDbUrl = actualDbUrl || '';
  }

  async onModuleInit() {
    await this.$connect();
    const dbHost = this.targetDbUrl.includes('@') ? this.targetDbUrl.split('@')[1] : 'local';
    console.log(`🚀 Database connected to: ${dbHost}`);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
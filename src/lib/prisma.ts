// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
	pool: Pool | undefined;
};

const connectionString = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('Missing DIRECT_DATABASE_URL/DATABASE_URL for Prisma');
}

const normalizePgConnectionString = (value: string) => {
	try {
		const url = new URL(value);
		if (
			url.searchParams.get('sslmode') === 'require' &&
			url.searchParams.get('uselibpqcompat') !== 'true'
		) {
			url.searchParams.set('uselibpqcompat', 'true');
		}
		return url.toString();
	} catch {
		return value;
	}
};

const pgConnectionString = normalizePgConnectionString(connectionString);

const pool =
	globalForPrisma.pool ??
	new Pool({
		connectionString: pgConnectionString,
		ssl: pgConnectionString.includes('sslmode=require')
			? { rejectUnauthorized: false }
			: undefined,
	});

export const prisma =
	globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg(pool) });

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
	globalForPrisma.pool = pool;
}

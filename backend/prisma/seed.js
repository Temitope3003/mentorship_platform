"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seed...');
    const hash1 = await bcrypt.hash('MENTOR2025', 12);
    const mentor1 = await prisma.mentor.upsert({
        where: { email: 'temitope@mlops.dev' },
        update: {},
        create: {
            email: 'temitope@mlops.dev',
            passwordHash: hash1,
            name: 'Owolabi Temitope',
        },
    });
    console.log('Created mentor 1:', mentor1.email);
    const hash2 = await bcrypt.hash('MENTOR2025', 12);
    const mentor2 = await prisma.mentor.upsert({
        where: { email: 'profjim@mlops.dev' },
        update: {},
        create: {
            email: 'profjim@mlops.dev',
            passwordHash: hash2,
            name: 'Owolabi Shina',
        },
    });
    console.log('Created mentor 2:', mentor2.email);
    const mentee = await prisma.mentee.upsert({
        where: { email: 'amara@test.com' },
        update: {},
        create: {
            name: 'Amara Johnson',
            email: 'amara@test.com',
            accessCode: 'AMARA-1234',
            domainTrack: 'AI & Machine Learning',
            topMatch: 'AI & Machine Learning',
            secondMatch: 'Data',
            isActive: true,
            mentorId: mentor1.id,
        },
    });
    console.log('Test mentee created:');
    console.log('  Name:        ' + mentee.name);
    console.log('  Access Code: ' + mentee.accessCode);
    console.log('  Domain:      ' + mentee.domainTrack);
    console.log('Seed complete.');
}
main()
    .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const prisma_service_1 = require("../../database/prisma.service");
function fmtCurrency(value) {
    const num = typeof value === 'object' && value !== null
        ? parseFloat(value.toString())
        : Number(value);
    if (isNaN(num))
        return '—';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}
function fmtDate(date) {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
let ContractsService = class ContractsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(tenantId, cardId) {
        return this.prisma.contract.findMany({
            where: { tenantId, ...(cardId ? { cardId } : {}) },
            include: {
                card: {
                    include: { contact: true, vehicle: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(tenantId, id) {
        const contract = await this.prisma.contract.findFirst({
            where: { id, tenantId },
            include: {
                card: { include: { contact: true, vehicle: true } },
                tenant: true,
            },
        });
        if (!contract)
            throw new common_1.NotFoundException('Contract not found');
        return contract;
    }
    async create(tenantId, dto) {
        const card = await this.prisma.card.findFirst({
            where: { id: dto.cardId, tenantId },
            include: { contact: true, vehicle: true },
        });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        const content = dto.content ?? this.renderTemplate(dto.template, card);
        return this.prisma.contract.create({
            data: {
                cardId: dto.cardId,
                tenantId,
                number: dto.number,
                template: dto.template,
                content,
            },
        });
    }
    async update(tenantId, id, dto) {
        await this.findOne(tenantId, id);
        const data = { ...dto };
        if (dto.status === 'SIGNED') {
            data.signedAt = new Date();
        }
        return this.prisma.contract.update({ where: { id }, data });
    }
    async generatePdf(tenantId, id) {
        const contract = await this.findOne(tenantId, id);
        return this.buildPdf(contract);
    }
    renderTemplate(template, card) {
        const c = card.contact;
        const v = card.vehicle;
        const price = v?.price ?? card.value;
        const lines = [
            `CONTRATO DE ${template.toUpperCase()}`,
            `Negociação: ${card.title}`,
            '',
            '=== COMPRADOR ===',
            `Nome: ${c?.name ?? 'A identificar'}`,
            c?.document ? `CPF/CNPJ: ${c.document}` : '',
            c?.phone ? `Telefone: ${c.phone}` : '',
            c?.email ? `E-mail: ${c.email}` : '',
            '',
            '=== VEÍCULO ===',
            v ? `${v.brand} ${v.model} ${v.year}` : 'A definir',
            v?.plate ? `Placa: ${v.plate}` : '',
            v?.color ? `Cor: ${v.color}` : '',
            v?.mileage != null ? `Quilometragem: ${v.mileage.toLocaleString('pt-BR')} km` : '',
            price != null ? `Valor: ${fmtCurrency(price)}` : '',
            '',
            '=== CONDIÇÕES ===',
            'O presente contrato é firmado entre as partes acima qualificadas, nas seguintes condições:',
            '1. O veículo é vendido no estado em que se encontra, conforme descrito acima.',
            '2. O pagamento deverá ser efetuado conforme acordado entre as partes.',
            '3. A transferência de propriedade ocorrerá após a quitação integral do valor.',
            '4. Quaisquer pendências de multas ou tributos anteriores à data deste contrato são de responsabilidade do vendedor.',
        ].filter((l) => l !== '' || l === '');
        return lines.join('\n');
    }
    buildPdf(contract) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                margin: 60,
                size: 'A4',
                info: {
                    Title: `Contrato ${contract.number}`,
                    Author: contract.tenant.name,
                },
            });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            const pageW = doc.page.width - 120;
            const c = contract.card.contact;
            const v = contract.card.vehicle;
            const price = v?.price ?? contract.card.value;
            doc
                .fontSize(18)
                .font('Helvetica-Bold')
                .text(contract.tenant.name, { align: 'center' });
            doc
                .fontSize(13)
                .font('Helvetica-Bold')
                .text(`CONTRATO DE ${contract.template.toUpperCase()}`, { align: 'center' });
            doc.moveDown(0.4);
            doc
                .fontSize(10)
                .font('Helvetica')
                .text(`Nº ${contract.number}   ·   Data: ${fmtDate(contract.createdAt)}`, { align: 'center' });
            if (contract.status === 'SIGNED' && contract.signedAt) {
                doc.text(`Assinado em: ${fmtDate(contract.signedAt)}`, { align: 'center' });
            }
            doc.moveDown(1);
            doc.moveTo(60, doc.y).lineTo(60 + pageW, doc.y).strokeColor('#cccccc').stroke();
            doc.moveDown(1);
            this.pdfSection(doc, 'COMPRADOR');
            this.pdfRow(doc, 'Nome', c?.name ?? 'A identificar');
            if (c?.document)
                this.pdfRow(doc, 'CPF/CNPJ', c.document);
            if (c?.phone)
                this.pdfRow(doc, 'Telefone', c.phone);
            if (c?.email)
                this.pdfRow(doc, 'E-mail', c.email);
            doc.moveDown(0.8);
            this.pdfSection(doc, 'VEÍCULO');
            if (v) {
                this.pdfRow(doc, 'Veículo', `${v.brand} ${v.model} ${v.year}`);
                if (v.plate)
                    this.pdfRow(doc, 'Placa', v.plate);
                if (v.color)
                    this.pdfRow(doc, 'Cor', v.color);
                if (v.mileage != null)
                    this.pdfRow(doc, 'Quilometragem', `${v.mileage.toLocaleString('pt-BR')} km`);
            }
            else {
                doc.font('Helvetica').fontSize(10).text('Veículo a definir');
            }
            if (price != null) {
                doc.moveDown(0.4);
                doc
                    .font('Helvetica-Bold')
                    .fontSize(11)
                    .text(`Valor: ${fmtCurrency(price)}`);
            }
            doc.moveDown(0.8);
            this.pdfSection(doc, 'CONDIÇÕES GERAIS');
            const termos = [
                'O veículo é vendido no estado em que se encontra, conforme descrito acima.',
                'O pagamento deverá ser efetuado conforme acordado entre as partes.',
                'A transferência de propriedade ocorrerá após a quitação integral do valor.',
                'Quaisquer pendências de multas ou tributos anteriores à data deste contrato são de responsabilidade do vendedor.',
                'Este contrato é regido pelas leis da República Federativa do Brasil.',
            ];
            termos.forEach((t, i) => {
                doc.font('Helvetica').fontSize(10).text(`${i + 1}. ${t}`, { width: pageW, align: 'justify' });
                doc.moveDown(0.3);
            });
            doc.moveDown(2);
            const sigY = doc.y;
            const col = pageW / 2;
            doc.font('Helvetica').fontSize(10);
            doc.moveTo(60, sigY).lineTo(60 + col - 20, sigY).stroke();
            doc.moveTo(60 + col + 20, sigY).lineTo(60 + pageW, sigY).stroke();
            doc.moveDown(0.3);
            doc.text('Vendedor', 60, doc.y, { width: col - 20, align: 'center' });
            doc.text('Comprador', 60 + col + 20, sigY + doc.currentLineHeight() + 4, {
                width: col - 20,
                align: 'center',
            });
            doc.end();
        });
    }
    pdfSection(doc, title) {
        doc
            .font('Helvetica-Bold')
            .fontSize(11)
            .fillColor('#1F2937')
            .text(title);
        doc.moveDown(0.3);
    }
    pdfRow(doc, label, value) {
        const x = doc.x;
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#374151').text(`${label}: `, { continued: true });
        doc.font('Helvetica').fillColor('#111827').text(value);
        doc.x = x;
        doc.moveDown(0.15);
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map
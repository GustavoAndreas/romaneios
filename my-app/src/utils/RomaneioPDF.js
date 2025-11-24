// src/utils/RomaneioPDF.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// helper simples pra formatar dinheiro
function formatMoney(value) {
    const n = Number(value || 0);
    return n.toFixed(2).replace('.', ',');
}

// Função principal
export async function gerarPDFRomaneio(romaneio, empresa) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 vertical

    const margin = 40;
    let y = 780; // início abaixo do topo

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // ============================
    // 0. NÚMERO DO PEDIDO + DATA (TOPO DIREITO)
    // ============================

    const numeroPedido = romaneio.pedidoSeq;
    const dataFormatada = romaneio.data
        ? new Date(romaneio.data).toLocaleDateString('pt-BR')
        : '';

    const textoTopo = `Pedido nº ${numeroPedido}  |  ${dataFormatada}`;
    const textWidthTopo = bold.widthOfTextAtSize(textoTopo, 12);

    page.drawText(textoTopo, {
        x: 555 - textWidthTopo,
        y: 810,
        size: 12,
        font: bold,
    });

    // ============================
    // 1. LOGO PNG DIRETO
    // ============================
    try {
        const logoBytes = await fetch('/logo.png').then((res) =>
            res.arrayBuffer()
        );
        const logoImg = await pdfDoc.embedPng(logoBytes);

        const logoWidth = 120;
        const logoHeight = (logoImg.height / logoImg.width) * 120;

        page.drawImage(logoImg, {
            x: margin,
            y: y - logoHeight,
            width: logoWidth,
            height: logoHeight,
        });
    } catch {
        console.log('⚠ Logo PNG não encontrado em /logo.png');
    }

    // ============================
    // 2. CABEÇALHO DA EMPRESA
    // ============================

    y -= 20;
    page.drawText(empresa.nome || 'Minha Empresa', {
        x: margin + 140,
        y,
        size: 18,
        font: bold,
    });
    y -= 22;

    page.drawText(`CNPJ: ${empresa.cnpj || ''}`, {
        x: margin + 140,
        y,
        size: 12,
        font,
    });
    y -= 15;

    page.drawText(
        `Contato: ${empresa.contato || ''}  |  Email: ${empresa.email || ''}`,
        {
            x: margin + 140,
            y,
            size: 12,
            font,
        }
    );
    y -= 15;

    page.drawText(
        `Endereço: ${empresa.rua || ''}, ${empresa.numero || ''} - ${empresa.cidade || ''}/${empresa.estado || ''} - CEP: ${empresa.cep || ''}`,
        {
            x: margin + 140,
            y,
            size: 12,
            font,
        }
    );

    // Linha separadora
    y -= 25;
    page.drawLine({
        start: { x: margin, y },
        end: { x: 555, y },
        thickness: 1,
        color: rgb(0.75, 0.75, 0.75),
    });

    // ============================
    // 3. BLOCO DO CLIENTE
    // ============================

    y -= 35;
    page.drawText('DADOS DO CLIENTE', { x: margin, y, size: 14, font: bold });
    y -= 22;

    // Nome do cliente
    page.drawText(`Cliente: ${romaneio.clienteNome || ''}`, {
        x: margin,
        y,
        size: 12,
        font,
    });
    y -= 16;

    // CNPJ do cliente
    const cnpjCliente =
        romaneio.clienteCnpj ??
        romaneio.cnpj ??
        romaneio.cliente?.cnpj ??
        '';

    page.drawText(`CNPJ: ${cnpjCliente}`, {
        x: margin,
        y,
        size: 12,
        font,
    });
    y -= 20;

    // Linha separadora depois do CNPJ
    page.drawLine({
        start: { x: margin, y },
        end: { x: 555, y },
        thickness: 1,
        color: rgb(0.75, 0.75, 0.75),
    });

    y -= 25;


    // ======================================
    // 4) TABELA: PRODUTO / QTD / UNIT / TOTAL
    // ======================================
    y -= 30;

    page.drawText('Produtos', {
        x: margin,
        y,
        size: 14,
        font: bold,
    });
    y -= 20;

    const headers = ['Produto', 'Qtd', 'Unit (R$)', 'Total (R$)'];
    const colX = [margin, margin + 260, margin + 320, margin + 410];

    // cabeçalho da tabela
    headers.forEach((h, i) => {
        page.drawText(h, {
            x: colX[i],
            y,
            size: 12,
            font: bold,
        });
    });

    y -= 12;
    page.drawLine({
        start: { x: margin, y },
        end: { x: 555, y },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.85),
    });

    y -= 18;

    const itens = romaneio?.itens || [];

    itens.forEach((item) => {
        const qtd = Number(item.quantidade ?? 0);
        const unit = Number(
            item.precoUnitario ??
            item.valorUnitario ??
            item.preco ??
            0
        );
        const total = Number(item.total ?? unit * qtd);

        page.drawText(item.nomeProduto || '', {
            x: colX[0],
            y,
            size: 12,
            font,
        });

        page.drawText(String(qtd), {
            x: colX[1],
            y,
            size: 12,
            font,
        });

        page.drawText(formatMoney(unit), {
            x: colX[2],
            y,
            size: 12,
            font,
        });

        page.drawText(formatMoney(total), {
            x: colX[3],
            y,
            size: 12,
            font,
        });

        y -= 16;
    });

    // ============================
    // 5. TOTAL GERAL
    // ============================

    y -= 30;

    const totalGeralNum = Number(romaneio.totalGeral ?? 0);

    page.drawText(`TOTAL GERAL: R$ ${formatMoney(totalGeralNum)}`, {
        x: margin,
        y,
        size: 16,
        font: bold,
        color: rgb(0.1, 0.1, 0.1),
    });

    // ============================
    // 6. FINALIZA: PDF + SHARE
    // ============================

    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });

    const filename = `romaneio-${(romaneio.clienteNome || 'cliente')
        .replace(/\s+/g, '-')
        .toLowerCase()}.pdf`;

    const pdfFile = new File([blob], filename, { type: 'application/pdf' });

    if (navigator.share && navigator.canShare?.({ files: [pdfFile] })) {
        try {
            await navigator.share({
                title: 'Romaneio',
                text: 'Seu romaneio está pronto!',
                files: [pdfFile],
            });
            return;
        } catch {
            // se o share falhar, cai no download normal
        }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

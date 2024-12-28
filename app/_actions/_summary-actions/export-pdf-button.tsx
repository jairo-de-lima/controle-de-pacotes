/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Button } from "@/app/_components/ui/button";
import { Courier, Delivery } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/app/_hooks/use-toast";

type DateRange = {
  from: Date;
  to: Date;
};

type ExportPDFButtonProps = {
  deliveries: Delivery[];
  selectedPerson: Courier | null;
  dateRange: DateRange;
};

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
  deliveries,
  selectedPerson,
  dateRange,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const analytics = useMemo(() => {
    return deliveries.reduce(
      (acc, delivery) => ({
        totalDeliveries: acc.totalDeliveries + 1,
        totalPackages: acc.totalPackages + delivery.packages,
        totalValue: acc.totalValue + delivery.totalValue,
        totalAdditional: acc.totalAdditional + (delivery.additionalFee || 0),
        dateRange: {
          from: delivery.date,
          to: delivery.date,
        },
      }),
      {
        totalDeliveries: 0,
        totalPackages: 0,
        totalValue: 0,
        totalAdditional: 0,
        dateRange: {
          from: deliveries.length ? deliveries[0].date : new Date(),
          to: deliveries.length ? deliveries[0].date : new Date(),
        },
      },
    );
  }, [deliveries]);

  const exportStructuredPDF = async () => {
    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Configuração inicial do PDF
      const pdf = new jsPDF();

      // Configurar fonte para suportar caracteres especiais
      pdf.setFont("helvetica");

      // Título do relatório
      pdf.setFontSize(16);
      pdf.text("Relatório de Entregas", 105, 15, { align: "center" });

      // Informações do período e entregador
      pdf.setFontSize(12);
      const periodText = `Período: ${format(dateRange.from, "dd/MM/yyyy", {
        locale: ptBR,
      })} até ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`;
      const deliveryPersonText =
        selectedPerson === null
          ? "Entregador: Todos os entregadores"
          : `Entregador: ${selectedPerson?.name || ""}`;

      pdf.text(periodText, 14, 25);
      pdf.text(deliveryPersonText, 14, 32);

      // Resumo geral
      pdf.setFontSize(14);
      pdf.text("Resumo Geral", 14, 45);

      const summaryData = [
        ["Total de Rotas", analytics.totalDeliveries.toString()],
        ["Total de Pacotes", analytics.totalPackages.toString()],
        ["Valores Adicionais", `R$ ${analytics.totalAdditional.toFixed(2)}`],
        ["Saldo Total", `R$ ${analytics.totalValue.toFixed(2)}`],
      ];

      autoTable(pdf, {
        startY: 50,
        head: [["Métrica", "Valor"]],
        body: summaryData,
        theme: "grid",
        styles: { fontSize: 12, cellPadding: 5 },
        headStyles: { fillColor: [71, 85, 105] },
      });

      // Se um entregador específico estiver selecionado, mostrar detalhamento
      if (selectedPerson !== null && analytics.totalDeliveries > 0) {
        pdf.setFontSize(14);
        pdf.text(
          "Detalhamento por Data",
          pdf.internal.pageSize.width / 2, // Centraliza horizontalmente na página
          (pdf as any).lastAutoTable.finalY + 15, // Mantém a posição vertical relativa à última tabela
          { align: "center" }, // Garante que o texto fique centralizado
        );

        // Preparar dados para a tabela detalhada
        const detailedData = deliveries.map((delivery) => [
          format(delivery.date, "dd/MM/yyyy", { locale: ptBR }),
          delivery.packages.toString(),
          `R$ ${(delivery.additionalFee || 0).toFixed(2)}`,
          `R$ ${delivery.totalValue.toFixed(2)}`,
        ]);

        autoTable(pdf, {
          startY: (pdf as any).lastAutoTable.finalY + 20,
          head: [["Data", "Pacotes", "Valor Adicional", "Valor Total"]],
          body: detailedData,
          theme: "grid",
          styles: { fontSize: 11, cellPadding: 5 },
          headStyles: { fillColor: [71, 85, 105] },
          columnStyles: {
            0: { cellWidth: 40, halign: "center" },
            1: { cellWidth: 30, halign: "center" },
            2: { cellWidth: 40, halign: "right" },
            3: { cellWidth: 40, halign: "right" },
          },
        });
      }

      // Adicionar rodapé
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(
          `Página ${i} de ${pageCount}`,
          pdf.internal.pageSize.width / 2,
          pdf.internal.pageSize.height - 10,
          { align: "center" },
        );
        pdf.text(
          `Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          })}`,
          14,
          pdf.internal.pageSize.height - 10,
        );
      }

      // Gerar nome do arquivo
      const dateStr = format(new Date(), "dd-MM-yyyy");
      const personName =
        selectedPerson === null
          ? "todos"
          : selectedPerson?.name?.toLowerCase().replace(/\s+/g, "-") ||
            "entregador";

      // Salvar o PDF
      pdf.save(`relatorio-entregas-${personName}-${dateStr}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={exportStructuredPDF} disabled={isExporting}>
      {isExporting ? "Exportando..." : "Exportar PDF"}
    </Button>
  );
};

export { ExportPDFButton };

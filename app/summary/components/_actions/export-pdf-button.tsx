import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "@/app/_components/ui/button";

export function ExportPDFButton({ analytics }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const pdf = new jsPDF();
    pdf.text("Relatório de Entregas", 20, 20);
    pdf.autoTable({
      head: [["Métrica", "Valor"]],
      body: [
        ["Total de Entregas", analytics.totalDeliveries],
        ["Total de Pacotes", analytics.totalPackages],
        ["Valor Total", `R$ ${analytics.totalValue.toFixed(2)}`],
      ],
    });
    pdf.save("relatorio.pdf");
    setIsExporting(false);
  };

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      {isExporting ? "Exportando..." : "Exportar PDF"}
    </Button>
  );
}

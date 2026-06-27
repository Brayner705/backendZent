import puppeteer from "puppeteer";
import fs from "fs";
import Handlebars from "handlebars";

export const reporteHistoriesDeleted = async (datosHistorial, username) => {
    try {
        console.log("Generating PDF report for deleted histories...");

        console.log("Data PDF: ", datosHistorial);
        console.log("Username for PDF report: ", username);

        const htmlStatic = fs.readFileSync('./templates/reporte_historiales_eliminados.html', 'utf-8');

        const template = Handlebars.compile(htmlStatic);

        const datosLimpios = JSON.parse(JSON.stringify(datosHistorial));
        const nombreLimpio = JSON.parse(JSON.stringify(username));

        const htmlContent = template({ historiales: datosLimpios, name: nombreLimpio });

        const browser = await puppeteer.launch();

        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.pdf({ path: `./reports/reporte_historiales_eliminados_${username}.pdf`, format: 'A4' });
        
        await browser.close();
        console.log("PDF report generated successfully.");

    }catch (error) {
        console.error("Error generating PDF report: ", error);
    }
}
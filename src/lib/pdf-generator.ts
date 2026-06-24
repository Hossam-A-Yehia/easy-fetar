"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { BreadType, StoredOrder } from "@/types";
import { breadLabel } from "@/lib/bread";
import { BRAND } from "@/lib/brand";

function getSaladLabel(salad: boolean | null): string {
  if (salad === true) return "مع سلطة وطحينة";
  if (salad === false) return "بدون سلطة وطحينة";
  return "";
}

function createOrdersHtml(orders: StoredOrder[], logoBase64: string): string {
  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalItems = orders.reduce((sum, o) => sum + o.lines.length, 0);

  let html = `
    <div id="pdf-content" style="
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      direction: rtl;
      text-align: right;
      padding: 0;
      background: white;
      color: #1a1a1a;
      width: 750px;
    ">
      <!-- Header with gradient background -->
      <div style="
        background: linear-gradient(135deg, ${BRAND.accent} 0%, ${BRAND.accentDark} 100%);
        padding: 30px 35px;
        color: white;
        position: relative;
        overflow: hidden;
      ">
        <!-- Decorative circles -->
        <div style="
          position: absolute;
          top: -30px;
          left: -30px;
          width: 120px;
          height: 120px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        "></div>
        <div style="
          position: absolute;
          bottom: -40px;
          right: 100px;
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.08);
          border-radius: 50%;
        "></div>
        
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        ">
          <div>
            <h1 style="
              font-size: 32px;
              margin: 0 0 5px 0;
              font-weight: 800;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">ملخص طلبات </h1>
            <p style="
              font-size: 14px;
              margin: 0;
              opacity: 0.9;
            ">${today}</p>
          </div>
          ${logoBase64 ? `
          <div style="
            background: white;
            padding: 10px;
            border-radius: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          ">
            <img src="${logoBase64}" style="
              height: 60px;
              width: auto;
              display: block;
            " />
          </div>
          ` : `
          <div style="
            background: white;
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          ">
            <span style="
              font-size: 20px;
              font-weight: 800;
              color: ${BRAND.accent};
            ">${BRAND.arName}</span>
          </div>
          `}
        </div>
      </div>

      <!-- Stats bar -->
      <div style="
        display: flex;
        background: #fafafa;
        border-bottom: 1px solid #eee;
      ">
        <div style="
          flex: 1;
          padding: 18px 25px;
          text-align: center;
          border-left: 1px solid #eee;
        ">
          <div style="
            font-size: 28px;
            font-weight: 800;
            color: ${BRAND.accent};
          ">${orders.length}</div>
          <div style="
            font-size: 12px;
            color: #888;
            margin-top: 2px;
          ">أوردر</div>
        </div>
        <div style="
          flex: 1;
          padding: 18px 25px;
          text-align: center;
          border-left: 1px solid #eee;
        ">
          <div style="
            font-size: 28px;
            font-weight: 800;
            color: ${BRAND.accent};
          ">${totalItems}</div>
          <div style="
            font-size: 12px;
            color: #888;
            margin-top: 2px;
          ">صنف</div>
        </div>
        <div style="
          flex: 1;
          padding: 18px 25px;
          text-align: center;
        ">
          <div style="
            font-size: 28px;
            font-weight: 800;
            color: ${BRAND.accent};
          ">${new Set(orders.flatMap(o => o.lines.map(l => l.menuItemName))).size}</div>
          <div style="
            font-size: 12px;
            color: #888;
            margin-top: 2px;
          ">نوع مختلف</div>
        </div>
      </div>

      <!-- Orders container -->
      <div style="padding: 25px 30px;">
  `;

  orders.forEach((order, index) => {
    html += `
      <div style="
        background: white;
        border-radius: 16px;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        border: 1px solid #f0f0f0;
        overflow: hidden;
      ">
        <!-- Order header -->
        <div style="
          background: linear-gradient(135deg, #fef7f0 0%, #fff9f5 100%);
          padding: 16px 22px;
          border-bottom: 1px solid rgba(245,130,32,0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="
              background: linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accentDark});
              color: white;
              width: 36px;
              height: 36px;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: 700;
              box-shadow: 0 3px 8px rgba(245,130,32,0.3);
            ">#${index + 1}</div>
            <div>
              <div style="
                font-size: 18px;
                font-weight: 700;
                color: #2d2d2d;
              ">${order.employeeName}</div>
              <div style="
                font-size: 11px;
                color: #999;
                margin-top: 1px;
              ">${order.lines.length} ${order.lines.length === 1 ? 'صنف' : 'أصناف'}</div>
            </div>
          </div>
          <div style="
            background: white;
            border: 1.5px solid ${BRAND.accent};
            color: ${BRAND.accent};
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
          ">طلب #${index + 1}</div>
        </div>
        
        <!-- Order items -->
        <div style="padding: 8px 0;">
    `;

    order.lines.forEach((line, lineIndex) => {
      const breadText = breadLabel(line.breadType);
      const saladText = getSaladLabel(line.saladAndTahini);
      const isLast = lineIndex === order.lines.length - 1;

      html += `
        <div style="
          padding: 14px 22px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          ${!isLast ? 'border-bottom: 1px solid #f5f5f5;' : ''}
        ">
          <div style="
            background: linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accentLight});
            color: white;
            min-width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            box-shadow: 0 2px 6px rgba(245,130,32,0.25);
          ">${line.quantity}</div>
          <div style="flex: 1;">
            <div style="
              font-size: 15px;
              font-weight: 600;
              color: #333;
              margin-bottom: 6px;
            ">${line.menuItemName}</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span style="
                background: #f8f8f8;
                color: #666;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 500;
                border: 1px solid #eee;
              ">🍞 ${breadText}</span>
              ${saladText ? `
              <span style="
                background: ${saladText.includes('مع') ? '#ecfdf5' : '#fef2f2'};
                color: ${saladText.includes('مع') ? '#059669' : '#dc2626'};
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 500;
                border: 1px solid ${saladText.includes('مع') ? '#d1fae5' : '#fecaca'};
              ">🥗 ${saladText}</span>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });

    if (order.notes) {
      html += `
        <div style="
          margin: 0 22px 16px 22px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border-radius: 10px;
          border-right: 4px solid #f59e0b;
        ">
          <div style="
            font-size: 11px;
            font-weight: 600;
            color: #b45309;
            margin-bottom: 4px;
          ">📝 ملاحظات</div>
          <div style="
            font-size: 13px;
            color: #78350f;
            line-height: 1.5;
          ">${order.notes}</div>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;
  });

  html += `
      </div>

      <!-- Footer -->
      <div style="
        background: linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%);
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div style="
          color: rgba(255,255,255,0.6);
          font-size: 11px;
        ">
          تم إنشاء هذا الملخص بواسطة ${BRAND.arName}
        </div>
        <div style="
          display: flex;
          align-items: center;
          gap: 15px;
        ">
          <div style="
            text-align: left;
            color: white;
          ">
            <div style="font-size: 11px; opacity: 0.6;">الإجمالي</div>
            <div style="font-size: 18px; font-weight: 700;">${orders.length} أوردر · ${totalItems} صنف</div>
          </div>
        </div>
      </div>
    </div>
  `;

  return html;
}

async function getLogoBase64(): Promise<string> {
  try {
    const response = await fetch("/logo.png");
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

export async function generateOrdersPdf(orders: StoredOrder[]): Promise<void> {
  const logoBase64 = await getLogoBase64();
  
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.innerHTML = createOrdersHtml(orders, logoBase64);
  document.body.appendChild(container);

  const content = container.querySelector("#pdf-content") as HTMLElement;

  try {
    const canvas = await html2canvas(content, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `orders-${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

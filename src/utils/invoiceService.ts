import { Invoice, InvoiceItem } from '../types/payment.types';

/**
 * Invoice Service - Handles invoice generation, formatting, and PDF export
 */

export interface InvoiceGenerationData {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientEmail?: string;
  providerName: string;
  providerEmail?: string;
  amount: number;
  taxPercentage?: number;
  items?: InvoiceItem[];
  notes?: string;
}

/**
 * Generate a new invoice
 */
export const generateInvoice = (data: InvoiceGenerationData): Invoice => {
  const now = new Date();
  const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  const items: InvoiceItem[] = data.items || [
    {
      description: data.serviceName,
      quantity: 1,
      unitPrice: data.amount,
      total: data.amount,
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxPercentage = data.taxPercentage || 10;
  const tax = (subtotal * taxPercentage) / 100;
  const total = subtotal + tax;

  return {
    id: generateInvoiceId(),
    paymentIntentId: `pi_${Date.now()}`,
    bookingId: data.bookingId,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    clientName: data.clientName,
    providerName: data.providerName,
    amount: subtotal,
    tax: tax,
    total: total,
    dueDate: dueDate.toISOString(),
    issuedDate: now.toISOString(),
    status: 'draft',
    items: items,
    notes: data.notes,
  };
};

/**
 * Generate a unique invoice ID
 */
export const generateInvoiceId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `INV-${timestamp}-${random}`.toUpperCase();
};

/**
 * Calculate invoice totals
 */
export const calculateInvoiceTotals = (
  items: InvoiceItem[],
  taxPercentage: number = 10
) => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = (subtotal * taxPercentage) / 100;
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    total,
  };
};

/**
 * Format invoice for display
 */
export const formatInvoiceForDisplay = (invoice: Invoice) => {
  return {
    ...invoice,
    items: invoice.items.map(item => ({
      ...item,
      total: parseFloat(item.total.toFixed(2)),
    })),
    tax: parseFloat(invoice.tax.toFixed(2)),
    amount: parseFloat(invoice.amount.toFixed(2)),
    total: parseFloat(invoice.total.toFixed(2)),
  };
};

/**
 * Generate HTML for invoice (for email or display)
 */
export const generateInvoiceHTML = (invoice: Invoice): string => {
  const issueDate = new Date(invoice.issuedDate).toLocaleDateString();
  const dueDate = new Date(invoice.dueDate).toLocaleDateString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; }
        .title { font-size: 28px; font-weight: bold; }
        .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .section-title { font-size: 14px; font-weight: bold; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; }
        .section-content { font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; border-bottom: 1px solid #e5e7eb; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .totals { display: flex; justify-content: flex-end; margin-top: 30px; }
        .totals-table { width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .total-final { display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: bold; }
        .status { display: inline-block; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .status.draft { background-color: #f3f4f6; color: #1f2937; }
        .status.paid { background-color: #d1fae5; color: #065f46; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <div class="title">INVOICE</div>
            <div class="section-content">#${invoice.id}</div>
          </div>
          <div style="text-align: right;">
            <span class="status ${invoice.status}">${invoice.status}</span>
          </div>
        </div>

        <div class="invoice-details">
          <div>
            <div class="section-title">Bill From</div>
            <div class="section-content">
              <strong>${invoice.providerName}</strong><br>
            </div>
          </div>
          <div>
            <div class="section-title">Bill To</div>
            <div class="section-content">
              <strong>${invoice.clientName}</strong><br>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
          <div>
            <div class="section-title">Issue Date</div>
            <div class="section-content">${issueDate}</div>
          </div>
          <div>
            <div class="section-title">Due Date</div>
            <div class="section-content">${dueDate}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td style="text-align: right;">${item.quantity}</td>
                <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                <td style="text-align: right;">$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-table">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>$${invoice.amount.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax:</span>
              <span>$${invoice.tax.toFixed(2)}</span>
            </div>
            <div class="total-final">
              <span>Total:</span>
              <span>$${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        ${invoice.notes ? `
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <div class="section-title">Notes</div>
            <div class="section-content">${invoice.notes}</div>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};

/**
 * Convert invoice to CSV format
 */
export const invoiceToCSV = (invoice: Invoice): string => {
  let csv = 'Invoice Items\n';
  csv += 'Description,Quantity,Unit Price,Total\n';

  invoice.items.forEach(item => {
    csv += `"${item.description}",${item.quantity},${item.unitPrice.toFixed(2)},${item.total.toFixed(2)}\n`;
  });

  csv += '\n\n';
  csv += `Subtotal,${invoice.amount.toFixed(2)}\n`;
  csv += `Tax,${invoice.tax.toFixed(2)}\n`;
  csv += `Total,${invoice.total.toFixed(2)}\n`;

  return csv;
};

/**
 * Mock PDF generation (would use a real library like jsPDF in production)
 */
export const generateInvoicePDF = async (invoice: Invoice): Promise<Blob> => {
  const html = generateInvoiceHTML(invoice);
  
  // This is a placeholder - in production, you'd use jsPDF or similar
  return new Blob([html], { type: 'application/pdf' });
};

/**
 * Email invoice
 */
export const emailInvoice = async (
  invoice: Invoice,
  toEmail: string,
  fromEmail?: string
): Promise<void> => {
  // This would be called via backend API
  console.log(`Sending invoice ${invoice.id} to ${toEmail}`);
  
  // In production, this would call your backend email service
  // return await apiClient.post('/emails/send-invoice', {
  //   invoiceId: invoice.id,
  //   toEmail,
  //   fromEmail,
  // });
};

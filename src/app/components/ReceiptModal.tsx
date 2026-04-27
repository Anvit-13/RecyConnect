import { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Printer, Download, X, Loader2, Leaf, CheckCircle2 } from 'lucide-react';
import pickupService, { PickupRequest } from '../../services/pickupService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

interface ReceiptModalProps {
  requestId: string;
  open: boolean;
  onClose: () => void;
}

export function ReceiptModal({ requestId, open, onClose }: ReceiptModalProps) {
  const { user } = useAuth();
  const [request, setRequest] = useState<PickupRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && requestId) {
      fetchDetail();
    }
  }, [open, requestId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await pickupService.getPickupRequestById(requestId);
      setRequest(response.data.pickupRequest);
    } catch (error: any) {
      toast.error('Could not load receipt details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const receiptHtml = receiptRef.current?.innerHTML;
    if (!receiptHtml) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>RecyConnect Receipt - ${requestId.substring(0, 8).toUpperCase()}</title>
        <meta charset="UTF-8" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; }
          .receipt { max-width: 680px; margin: 0 auto; padding: 40px 48px; }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            @page { margin: 0.5in; }
          }
        </style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div class="receipt">${receiptHtml}</div>
        <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!request && !loading) return null;

  const totalValue = request?.total_estimated_value
    ? parseFloat(String(request.total_estimated_value))
    : (request?.devices?.reduce((acc, d) => acc + (d.estimated_value || 0), 0) ?? 0);

  const receiptDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const pickupDate = request?.pickup_date || request?.pickupDate
    ? new Date(request.pickup_date || request.pickupDate!).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    : 'N/A';

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Device Collection Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint} disabled={loading} className="h-8">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable receipt preview */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
              <p>Generating receipt…</p>
            </div>
          ) : request ? (
            <div
              ref={receiptRef}
              style={{
                fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
                background: '#ffffff',
                color: '#111827',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              {/* ── HEADER ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 20h20M12 4v12M8 8l4-4 4 4M6 16c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v4H6v-4z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '18px', color: '#10b981' }}>RecyConnect</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>E-Waste Management System</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>COLLECTION RECEIPT</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                    #{requestId.substring(0, 8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Issued: {receiptDate}</div>
                </div>
              </div>

              {/* ── DIVIDER ── */}
              <div style={{ height: '2px', background: 'linear-gradient(90deg, #10b981, #14b8a6, transparent)', marginBottom: '24px', borderRadius: '1px' }} />

              {/* ── PARTIES ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Customer Details
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{user?.name || 'N/A'}</div>
                  <div style={{ color: '#6b7280', marginTop: '2px' }}>{user?.email || 'N/A'}</div>
                  {user?.phone && <div style={{ color: '#6b7280' }}>{user.phone}</div>}
                  {request.address && (
                    <div style={{ color: '#6b7280', marginTop: '4px', fontSize: '12px' }}>
                      📍 {request.address}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Collection Info
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><span style={{ color: '#6b7280' }}>Pickup Date: </span><span style={{ fontWeight: 600 }}>{pickupDate}</span></div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Status: </span>
                      <span style={{
                        fontWeight: 600,
                        color: request.status === 'completed' ? '#10b981' : request.status === 'in-progress' ? '#14b8a6' : '#f59e0b',
                        textTransform: 'capitalize',
                      }}>
                        {(request.status || 'pending').replace('-', ' ')}
                      </span>
                    </div>
                    {request.collector_name && (
                      <div><span style={{ color: '#6b7280' }}>Collector: </span><span style={{ fontWeight: 600 }}>{request.collector_name}</span></div>
                    )}
                    {request.recycler_name && (
                      <div><span style={{ color: '#6b7280' }}>Recycler: </span><span style={{ fontWeight: 600 }}>{request.recycler_name}</span></div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── DEVICES TABLE ── */}
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Device Details
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ background: '#f0fdf4' }}>
                    {['#', 'Device', 'Brand / Model', 'Condition', 'Qty', 'Est. Value (₹)'].map(h => (
                      <th key={h} style={{
                        padding: '10px 12px', textAlign: h === 'Qty' || h === 'Est. Value (₹)' ? 'right' : 'left',
                        fontSize: '11px', fontWeight: 700, color: '#374151',
                        borderBottom: '2px solid #d1fae5', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {request.devices && request.devices.length > 0 ? (
                    request.devices.map((device, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 500 }}>
                          {device.device_type || device.deviceType || 'N/A'}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>
                          {device.brand} {device.model}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600,
                            background: device.condition === 'working' ? '#d1fae5' : device.condition === 'broken' ? '#fee2e2' : '#fef9c3',
                            color: device.condition === 'working' ? '#065f46' : device.condition === 'broken' ? '#991b1b' : '#713f12',
                          }}>
                            {(device.condition || 'N/A').replace('-', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500 }}>{device.quantity}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500 }}>
                          {device.estimated_value ? `₹${parseFloat(String(device.estimated_value)).toFixed(2)}` : '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                        Device details not available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* ── TOTALS ── */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
                <div style={{ minWidth: '260px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f0fdf4', borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: '15px', borderTop: '2px solid #10b981' }}>
                    <span>Total Estimated Value</span>
                    <span style={{ color: '#10b981' }}>₹{totalValue.toFixed(2)}</span>
                  </div>
                  {request.devices && request.devices.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: '#f9fafb', fontSize: '12px', color: '#6b7280' }}>
                      <span>Total Devices</span>
                      <span>{request.devices.reduce((acc, d) => acc + Number(d.quantity || 1), 0)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── NOTES ── */}
              {request.notes && (
                <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', borderLeft: '3px solid #10b981' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>NOTES</div>
                  <div style={{ color: '#374151' }}>{request.notes}</div>
                </div>
              )}

              {/* ── FOOTER ── */}
              <div style={{ borderTop: '1px dashed #d1d5db', paddingTop: '20px', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: '#10b981', marginBottom: '4px', fontSize: '14px' }}>
                  🌱 Thank you for recycling responsibly!
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', lineHeight: '1.6' }}>
                  This receipt confirms that your e-waste has been submitted for proper collection and recycling.<br />
                  RecyConnect · E-Waste Management System · support@recyconnect.com
                </div>
                <div style={{ marginTop: '12px', fontSize: '10px', color: '#9ca3af' }}>
                  Receipt No. {requestId.toUpperCase()} · Generated on {receiptDate}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

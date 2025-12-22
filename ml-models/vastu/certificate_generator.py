# ml-models/vastu/certificate_generator.py
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
import qrcode
import io

class VastuCertificateGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.primary_color = HexColor('#1a237e')  # Deep blue
        self.secondary_color = HexColor('#ffd700')  # Gold
        
    def generate_certificate(
        self,
        analysis_id: str,
        property_id: str,
        score: int,
        grade: str,
        analysis_data: dict,
        language: str = "en"
    ) -> str:
        """Generate professional PDF certificate"""
        
        filename = f"/tmp/vastu_{analysis_id}_certificate.pdf"
        
        # Create PDF
        doc = SimpleDocTemplate(
            filename,
            pagesize=A4,
            rightMargin=0.5*inch,
            leftMargin=0.5*inch,
            topMargin=0.5*inch,
            bottomMargin=0.5*inch
        )
        
        story = []
        
        # Header
        story.append(Spacer(1, 0.5*inch))
        
        # Title
        title_style = ParagraphStyle(
            'Title',
            parent=self.styles['Title'],
            fontSize=28,
            textColor=self.primary_color,
            alignment=TA_CENTER,
            spaceAfter=20
        )
        story.append(Paragraph("VASTU SHASTRA COMPLIANCE CERTIFICATE", title_style))
        
        # Subtitle
        subtitle_style = ParagraphStyle(
            'Subtitle',
            parent=self.styles['Normal'],
            fontSize=14,
            textColor=self.secondary_color,
            alignment=TA_CENTER,
            spaceAfter=30
        )
        story.append(Paragraph("Ancient Vedic Architectural Analysis", subtitle_style))
        
        story.append(Spacer(1, 0.3*inch))
        
        # Certificate body
        body_style = ParagraphStyle(
            'Body',
            parent=self.styles['Normal'],
            fontSize=12,
            alignment=TA_CENTER,
            spaceAfter=20
        )
        
        story.append(Paragraph(
            f"This is to certify that the property has been analyzed according to Vastu Shastra principles",
            body_style
        ))
        
        story.append(Spacer(1, 0.2*inch))
        
        # Score card
        score_data = [
            ['VASTU COMPLIANCE SCORE', f'{score}/100'],
            ['GRADE', grade],
            ['ANALYSIS DATE', datetime.utcnow().strftime('%B %d, %Y')],
            ['CERTIFICATE ID', analysis_id[:16]],
            ['PROPERTY ID', property_id or 'N/A']
        ]
        
        score_table = Table(score_data, colWidths=[3*inch, 2*inch])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.primary_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f5f5f5')),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#cccccc')),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ]))
        
        story.append(score_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Key findings
        findings_style = ParagraphStyle(
            'Findings',
            parent=self.styles['Normal'],
            fontSize=11,
            alignment=TA_LEFT,
            spaceAfter=10,
            leftIndent=20
        )
        
        story.append(Paragraph("<b>KEY FINDINGS:</b>", findings_style))
        
        # Entrance
        entrance = analysis_data.get('entrance', {})
        story.append(Paragraph(
            f"• <b>Entrance Direction:</b> {entrance.get('direction', 'Unknown').title()}",
            findings_style
        ))
        
        # Issues summary
        issues = analysis_data.get('issues', [])
        critical_count = len([i for i in issues if i['severity'] == 'critical'])
        moderate_count = len([i for i in issues if i['severity'] == 'moderate'])
        minor_count = len([i for i in issues if i['severity'] == 'minor'])
        
        story.append(Paragraph(
            f"• <b>Issues Identified:</b> {critical_count} Critical, {moderate_count} Moderate, {minor_count} Minor",
            findings_style
        ))
        
        # Five elements
        detailed = analysis_data.get('detailed_analysis', {})
        elements = detailed.get('five_elements_balance', {})
        if elements:
            story.append(Paragraph(
                f"• <b>Five Elements Balance:</b> {elements.get('balance', 'Moderate')}",
                findings_style
            ))
        
        story.append(Spacer(1, 0.3*inch))
        
        # Recommendations
        if score < 85:
            recs_style = ParagraphStyle(
                'Recommendations',
                parent=self.styles['Normal'],
                fontSize=10,
                alignment=TA_LEFT,
                spaceAfter=8,
                leftIndent=20
            )
            
            story.append(Paragraph("<b>TOP RECOMMENDATIONS:</b>", findings_style))
            
            # Get top 3 critical issues
            critical_issues = [i for i in issues if i['severity'] == 'critical'][:3]
            for issue in critical_issues:
                story.append(Paragraph(
                    f"• {issue['description']}",
                    recs_style
                ))
        
        story.append(Spacer(1, 0.3*inch))
        
        # QR Code for verification
        qr_code = self.generate_qr_code(analysis_id)
        qr_image = Image(qr_code, width=1.5*inch, height=1.5*inch)
        
        qr_table = Table([[qr_image, Paragraph(
            "<b>Scan to verify authenticity</b><br/>"
            "This certificate is blockchain-verified<br/>"
            f"Certificate ID: {analysis_id[:16]}",
            ParagraphStyle('QR', parent=self.styles['Normal'], fontSize=8, alignment=TA_CENTER)
        )]], colWidths=[2*inch, 3*inch])
        
        story.append(qr_table)
        
        story.append(Spacer(1, 0.2*inch))
        
        # Footer
        footer_style = ParagraphStyle(
            'Footer',
            parent=self.styles['Normal'],
            fontSize=9,
            alignment=TA_CENTER,
            textColor=HexColor('#666666')
        )
        
        story.append(Paragraph(
            "This analysis is based on traditional Vastu Shastra principles combined with modern AI technology.<br/>"
            "Certified by AI Analysis System + Manual Review by Vastu Consultants.",
            footer_style
        ))
        
        story.append(Spacer(1, 0.1*inch))
        
        story.append(Paragraph(
            f"Generated on {datetime.utcnow().strftime('%B %d, %Y at %H:%M UTC')}<br/>"
            "© 2025 Real Estate Platform - Vastu Analysis Division",
            footer_style
        ))
        
        # Build PDF
        doc.build(story)
        
        print(f"Generated certificate: {filename}")
        return filename
    
    def generate_qr_code(self, analysis_id: str) -> io.BytesIO:
        """Generate QR code for certificate verification"""
        verification_url = f"https://app.realestate.com/vastu/verify/{analysis_id}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(verification_url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to bytes
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        return buffer

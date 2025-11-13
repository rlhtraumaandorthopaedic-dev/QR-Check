'use client';

import { CertificateTemplate } from '@/types/certificate';

interface CertificatePreviewProps {
  template: Omit<CertificateTemplate, 'id' | 'createdAt'>;
  userName: string;
  courseName: string;
  completionDate?: Date;
  backgroundImage?: string | null;
}

export default function CertificatePreview({
  template,
  userName,
  courseName,
  completionDate = new Date(),
  backgroundImage = null,
}: CertificatePreviewProps) {
  const renderField = (field: any) => {
    if (!field.enabled) return null;

    let displayValue = field.value;

    // Replace placeholders
    if (field.type === 'name') displayValue = userName;
    if (field.type === 'course') displayValue = courseName;
    if (field.type === 'date')
      displayValue = completionDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

    const responsiveFontSize = `clamp(${Math.max(field.fontSize * 0.4, 8)}px, ${field.fontSize * 0.06}vw, ${field.fontSize}px)`;

    return (
      <div
        key={field.id}
        style={{
          position: 'absolute',
          left: `${field.position.x}%`,
          top: `${field.position.y}%`,
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '100%',
          textAlign: field.alignment,
          fontSize: responsiveFontSize,
          fontWeight: field.fontWeight,
          color: field.color,
          fontFamily: template.fontFamily,
          lineHeight: '1.2',
          wordWrap: 'break-word',
          overflow: 'hidden',
        }}
      >
        {displayValue}
      </div>
    );
  };

  const getBorderStyle = () => {
    switch (template.layout) {
      case 'classic':
        return `8px solid ${template.borderColor}`;
      case 'modern':
        return `4px solid ${template.borderColor}`;
      case 'minimalist':
        return `1px solid ${template.borderColor}`;
      default:
        return `4px solid ${template.borderColor}`;
    }
  };

  return (
    <div
      id="certificate-preview"
      className="certificate-preview-container"
      style={{
        width: '100%',
        maxWidth: '100%',
        aspectRatio: '1.414', // A4 ratio
        backgroundColor: backgroundImage ? 'transparent' : template.backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: getBorderStyle(),
        borderRadius: template.layout === 'modern' ? '16px' : '4px',
        position: 'relative',
        padding: 'clamp(10px, 3vw, 40px)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements based on layout */}
      {template.layout === 'classic' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              height: '4px',
              background: `linear-gradient(90deg, ${template.primaryColor}, ${template.secondaryColor})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              height: '4px',
              background: `linear-gradient(90deg, ${template.primaryColor}, ${template.secondaryColor})`,
            }}
          />
        </>
      )}

      {template.layout === 'modern' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '150px',
              height: '150px',
              background: template.primaryColor,
              opacity: '0.1',
              borderTopLeftRadius: '16px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '150px',
              height: '150px',
              background: template.secondaryColor,
              opacity: '0.1',
              borderBottomRightRadius: '16px',
            }}
          />
        </>
      )}

      {/* Render all fields */}
      {template.fields.map(renderField)}
    </div>
  );
}

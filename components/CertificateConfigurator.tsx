'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CertificateTemplate, CertificateField } from '@/types/certificate';
import { Palette, Type, Layout, Save } from 'lucide-react';
import CertificatePreview from './CertificatePreview';

export default function CertificateConfigurator() {
  const [template, setTemplate] = useState<Omit<CertificateTemplate, 'id' | 'createdAt'>>({
    name: 'My Certificate Template',
    backgroundColor: '#ffffff',
    borderColor: '#2563eb',
    primaryColor: '#1e40af',
    secondaryColor: '#64748b',
    fontFamily: 'serif',
    layout: 'classic',
    isDefault: false,
    fields: [
      {
        id: 'title',
        type: 'text',
        label: 'Certificate Title',
        value: 'Certificate of Completion',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1e40af',
        alignment: 'center',
        position: { x: 50, y: 15 },
        enabled: true,
      },
      {
        id: 'subtitle',
        type: 'text',
        label: 'Subtitle',
        value: 'This certifies that',
        fontSize: 18,
        fontWeight: 'normal',
        color: '#64748b',
        alignment: 'center',
        position: { x: 50, y: 30 },
        enabled: true,
      },
      {
        id: 'name',
        type: 'name',
        label: 'Recipient Name',
        value: '[Student Name]',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
        alignment: 'center',
        position: { x: 50, y: 42 },
        enabled: true,
      },
      {
        id: 'course',
        type: 'course',
        label: 'Course Name',
        value: '[Course Name]',
        fontSize: 20,
        fontWeight: 'normal',
        color: '#374151',
        alignment: 'center',
        position: { x: 50, y: 55 },
        enabled: true,
      },
      {
        id: 'date',
        type: 'date',
        label: 'Completion Date',
        value: '[Date]',
        fontSize: 16,
        fontWeight: 'normal',
        color: '#6b7280',
        alignment: 'center',
        position: { x: 50, y: 70 },
        enabled: true,
      },
      {
        id: 'signature',
        type: 'signature',
        label: 'Signature',
        value: 'Authorized Signature',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#374151',
        alignment: 'center',
        position: { x: 50, y: 85 },
        enabled: true,
      },
    ],
  });

  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const updateTemplateField = (key: keyof typeof template, value: any) => {
    setTemplate({ ...template, [key]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setBackgroundImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearBackgroundImage = () => {
    setBackgroundImage(null);
  };

  const updateField = (fieldId: string, updates: Partial<CertificateField>) => {
    setTemplate({
      ...template,
      fields: template.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const templateData: Omit<CertificateTemplate, 'id'> = {
        ...template,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'certificate_templates'), templateData);
      setSavedId(docRef.id);
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto pt-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="premium-card rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="text-white" size={32} />
              <h1 className="text-2xl font-bold text-white">Certificate Configurator</h1>
            </div>

            <div className="space-y-6">
              {/* Basic Settings */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Layout size={20} />
                  Basic Settings
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) => updateTemplateField('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Layout Style
                    </label>
                    <select
                      value={template.layout}
                      onChange={(e) => updateTemplateField('layout', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="classic">Classic</option>
                      <option value="modern">Modern</option>
                      <option value="minimalist">Minimalist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Font Family
                    </label>
                    <select
                      value={template.fontFamily}
                      onChange={(e) => updateTemplateField('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="serif">Serif (Georgia, Times)</option>
                      <option value="sans-serif">Sans-Serif (Arial, Helvetica)</option>
                      <option value="cursive">Cursive (Script)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Custom Background Image
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                      />
                      {backgroundImage && (
                        <div className="flex gap-2">
                          <button
                            onClick={clearBackgroundImage}
                            className="text-xs text-red-400 hover:text-red-300 underline"
                          >
                            Remove Image
                          </button>
                          <span className="text-xs text-cyan-400">✓ Image uploaded</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Upload a custom certificate design (max 2MB, PNG/JPG)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Settings */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-white mb-3">Colors</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Background
                    </label>
                    <input
                      type="color"
                      value={template.backgroundColor}
                      onChange={(e) => updateTemplateField('backgroundColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Border
                    </label>
                    <input
                      type="color"
                      value={template.borderColor}
                      onChange={(e) => updateTemplateField('borderColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Primary
                    </label>
                    <input
                      type="color"
                      value={template.primaryColor}
                      onChange={(e) => updateTemplateField('primaryColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Secondary
                    </label>
                    <input
                      type="color"
                      value={template.secondaryColor}
                      onChange={(e) => updateTemplateField('secondaryColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Field Settings */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Type size={20} />
                  Text Fields
                </h3>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {template.fields.map((field) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">{field.label}</label>
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={(e) => updateField(field.id, { enabled: e.target.checked })}
                          className="rounded"
                        />
                      </div>

                      {field.enabled && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => updateField(field.id, { value: e.target.value })}
                            placeholder={field.label}
                            className="w-full px-2 py-1 text-sm border border-gray-700 rounded"
                          />

                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={field.fontSize}
                              onChange={(e) =>
                                updateField(field.id, { fontSize: parseInt(e.target.value) })
                              }
                              min="8"
                              max="72"
                              className="w-full px-2 py-1 text-sm border border-gray-700 rounded"
                              placeholder="Size"
                            />

                            <select
                              value={field.fontWeight}
                              onChange={(e) =>
                                updateField(field.id, { fontWeight: e.target.value as any })
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-700 rounded"
                            >
                              <option value="normal">Normal</option>
                              <option value="bold">Bold</option>
                            </select>

                            <input
                              type="color"
                              value={field.color}
                              onChange={(e) => updateField(field.id, { color: e.target.value })}
                              className="w-full h-8 rounded border border-gray-700 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-br from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 disabled:from-gray-600 disabled:to-gray-700 text-black disabled:text-gray-400 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Template'}
              </button>

              {savedId && (
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="text-sm text-cyan-300">
                    Template saved! ID: <code className="bg-green-100 px-2 py-1 rounded">{savedId}</code>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="premium-card rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
            <div className="overflow-x-auto">
              <CertificatePreview
                template={template}
                userName="John Doe"
                courseName="Sample Course"
                backgroundImage={backgroundImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createServiceSchema, CreateServiceData } from './adminSchema';
import { GHANA_REGIONS, getCitiesByRegion } from '../../utils/ghanaLocations';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import * as adminApi from '../../api/adminApi';

interface ServiceFormProps {
  onSubmit: (data: CreateServiceData) => Promise<void>;
  isLoading?: boolean;
  initialData?: any; // Using any for flexibility with partial data
  isEditing?: boolean;
}

const categories = [
  'Technology',
  'Design',
  'Security',
  'Events',
  'Logistics',
  'Legal',
  'Marketing',
  'Consulting',
  'Health',
  'Education',
];

export default function ServiceForm({ onSubmit, isLoading = false, initialData, isEditing = false }: ServiceFormProps) {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string>(initialData?.image || '');
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateServiceData>({
    resolver: zodResolver(createServiceSchema) as any,
    defaultValues: initialData,
  });

  const { fields: locations, append: addLocation, remove: removeLocation } = useFieldArray({
    control,
    name: 'locations',
  });

  const { fields: tagFields, append: addTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags' as any,
  });

  const { fields: briefingFields, append: addQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'briefingQuestions' as any,
  });

  // Function to get cities for a specific location index
  const getCitiesForLocation = (index: number) => {
    const rId = watch(`locations.${index}.regionId`);
    return rId ? getCitiesByRegion(rId) : [];
  };

  const onFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      toast.success('Service created successfully!');
      reset();
      setFormStep(1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create service');
    }
  };


  return (
    <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-800 -translate-y-1/2 -z-10" />
        {[1, 2, 3, 4].map(step => (
          <button
            key={step}
            type="button"
            onClick={() => setFormStep(step as 1 | 2 | 3 | 4)}
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl font-black transition-all duration-500 border-2 ${
              formStep === step
                ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(212,255,0,0.3)] scale-110'
                : formStep > step
                ? 'bg-zinc-900 border-primary/50 text-primary'
                : 'bg-zinc-950 border-zinc-800 text-zinc-600'
            }`}
          >
            {step}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest whitespace-nowrap opacity-60">
              {step === 1 ? 'Identity' : step === 2 ? 'Requirements' : step === 3 ? 'Geography' : 'Assets'}
            </span>
          </button>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {formStep === 1 && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(212,255,0,0.5)]" />
            <h3 className="text-xl font-black text-white uppercase tracking-tight">System Identity</h3>
          </div>

          <Input
            label="Service Title"
            placeholder="e.g., Elite Home Automation"
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400">Category Classification</label>
            <select
              {...register('category')}
              className="w-full h-12 px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-950/50 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
            >
              <option value="" className="bg-zinc-950 text-zinc-500">Select Classification</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-zinc-950 text-white">{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs font-medium mt-1">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400">Operational Log (Description)</label>
            <textarea
              {...register('description')}
              placeholder="Detailed description of your service..."
              className="w-full px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950/50 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none placeholder:text-zinc-700 min-h-[120px]"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-xs font-medium mt-1">{errors.description.message}</p>
            )}
          </div>

          <Input
            label="Base Credit Value (GHS)"
            type="number"
            step="0.01"
            placeholder="150.00"
            {...register('basePrice', { valueAsNumber: true })}
            error={errors.basePrice?.message}
          />

          <div className="flex gap-4 pt-8">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1 h-12 border-zinc-800 text-xs font-black uppercase tracking-widest"
              onClick={() => navigate('/admin/services')}
            >
              Abort Mission
            </Button>
            <Button
              type="button"
              onClick={() => setFormStep(2)}
              className="flex-1 h-12 neon-glow text-xs font-black uppercase tracking-widest"
            >
              Requirements Protocol
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Briefing Questions */}
      {formStep === 2 && (
        <div className="space-y-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(212,255,0,0.5)]" />
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Mission Requirements</h3>
          </div>

          <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-lg">
            Define the specific questions and data points you need from the client before you can begin work on their mission.
          </p>

          <div className="space-y-6">
            {briefingFields.map((field, index) => (
              <div key={field.id} className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 space-y-4 relative group">
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Briefing Question"
                    placeholder="e.g., What is your project deadline?"
                    {...register(`briefingQuestions.${index}.question` as any)}
                    error={errors.briefingQuestions?.[index]?.question?.message}
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Response Type</label>
                    <select
                      {...register(`briefingQuestions.${index}.type` as any)}
                      className="w-full h-12 px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-950/50 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                    >
                      <option value="text">Short Answer</option>
                      <option value="textarea">Long Briefing</option>
                      <option value="select">Multiple Choice</option>
                      <option value="file">File Upload / Document</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register(`briefingQuestions.${index}.required` as any)}
                      className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-primary focus:ring-primary/20"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">Mandatory Response</span>
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addQuestion({ question: '', type: 'text', required: true })}
              className="w-full flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-black uppercase tracking-widest text-[10px] py-4 border border-dashed border-primary/20 rounded-2xl hover:bg-primary/5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Briefing Question
            </button>
          </div>

          <div className="flex gap-4 pt-8">
            <Button
              type="button"
              onClick={() => setFormStep(1)}
              variant="secondary"
              className="flex-1 h-12 border-zinc-800 text-xs font-black uppercase tracking-widest"
            >
              Previous Sector
            </Button>
            <Button
              type="button"
              onClick={() => setFormStep(3)}
              className="flex-1 h-12 neon-glow text-xs font-black uppercase tracking-widest"
            >
              Geography Protocol
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Geography */}
      {formStep === 3 && (
        <div className="space-y-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(212,255,0,0.5)]" />
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Mission Requirements</h3>
          </div>

          <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-lg">
            Define the specific questions and data points you need from the client before you can begin work on their mission.
          </p>

          <div className="space-y-6">
            {briefingFields.map((field, index) => (
              <div key={field.id} className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 space-y-4 relative group">
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Briefing Question"
                    placeholder="e.g., What is your project deadline?"
                    {...register(`briefingQuestions.${index}.question` as any)}
                    error={errors.briefingQuestions?.[index]?.question?.message}
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Response Type</label>
                    <select
                      {...register(`briefingQuestions.${index}.type` as any)}
                      className="w-full h-12 px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-950/50 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                    >
                      <option value="text">Short Answer</option>
                      <option value="textarea">Long Briefing</option>
                      <option value="select">Multiple Choice</option>
                      <option value="file">File Upload / Document</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register(`briefingQuestions.${index}.required` as any)}
                      className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-primary focus:ring-primary/20"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">Mandatory Response</span>
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addQuestion({ question: '', type: 'text', required: true })}
              className="w-full flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-black uppercase tracking-widest text-[10px] py-4 border border-dashed border-primary/20 rounded-2xl hover:bg-primary/5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Briefing Question
            </button>
          </div>

          <div className="flex gap-4 pt-8">
            <Button
              type="button"
              onClick={() => setFormStep(2)}
              variant="secondary"
              className="flex-1 h-12 border-zinc-800 text-xs font-black uppercase tracking-widest"
            >
              Previous Sector
            </Button>
            <Button
              type="button"
              onClick={() => setFormStep(4)}
              className="flex-1 h-12 neon-glow text-xs font-black uppercase tracking-widest"
            >
              Geography Protocol
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Geography */}
      {formStep === 4 && (
        <div className="space-y-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(212,255,0,0.5)]" />
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Geographic Deployment</h3>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Contact Protocols</h4>
            <Input
              label="Neural Link (Phone)"
              placeholder="+233 24 123 4567"
              {...register('contact.phone')}
              error={errors.contact?.phone?.message}
            />
            <Input
              label="Data Stream (Email)"
              type="email"
              placeholder="contact@business.com"
              {...register('contact.email')}
              error={errors.contact?.email?.message}
            />
            <Input
              label="Network Portal (Website - Optional)"
              type="url"
              placeholder="https://yourbusiness.com"
              {...register('contact.website')}
              error={errors.contact?.website?.message}
            />
          </div>

          {/* Locations */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Operational Nodes</h4>
            </div>
            
            {locations.map((field, index) => (
              <div key={field.id} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3">
                  {locations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Regional Sector</label>
                    <select
                      {...register(`locations.${index}.regionId`)}
                      onChange={(e) => {
                        const rId = e.target.value;
                        const region = GHANA_REGIONS.find(r => r.id === rId);
                        if (region) {
                          register(`locations.${index}.region`).onChange({
                            target: { value: region.name, name: `locations.${index}.region` }
                          });
                        }
                      }}
                      className="w-full h-12 px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-950/50 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                    >
                      <option value="" className="bg-zinc-950 text-zinc-500">Select Region</option>
                      {GHANA_REGIONS.map(region => (
                        <option key={region.id} value={region.id} className="bg-zinc-950 text-white">
                          {region.name}
                        </option>
                      ))}
                    </select>
                    {errors.locations?.[index]?.regionId && (
                      <p className="text-red-500 text-xs font-medium mt-1">{errors.locations[index]?.regionId?.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Urban Center (City)</label>
                    <select
                      {...register(`locations.${index}.city`)}
                      className="w-full h-12 px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-950/50 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                    >
                      <option value="" className="bg-zinc-950 text-zinc-500">Select City</option>
                      {getCitiesForLocation(index).map(city => (
                        <option key={city} value={city} className="bg-zinc-950 text-white">{city}</option>
                      ))}
                    </select>
                    {errors.locations?.[index]?.city && (
                      <p className="text-red-500 text-xs font-medium mt-1">{errors.locations[index]?.city?.message}</p>
                    )}
                  </div>
                </div>

                <Input
                  label="Local Coordinates (Address - Optional)"
                  placeholder="Street address or landmark"
                  {...register(`locations.${index}.address`)}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addLocation({
                region: '',
                regionId: '',
                city: '',
                address: '',
              })}
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-black uppercase tracking-widest text-[10px] py-2 px-4 border border-primary/20 rounded-lg hover:bg-primary/5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Operational Node
            </button>
          </div>

          <div className="flex gap-4 pt-8">
            <Button
              type="button"
              onClick={() => setFormStep(1)}
              variant="secondary"
              className="flex-1 h-12 border-zinc-800 text-xs font-black uppercase tracking-widest"
            >
              Previous Sector
            </Button>
            <Button
              type="button"
              onClick={() => setFormStep(4)}
              className="flex-1 h-12 neon-glow text-xs font-black uppercase tracking-widest"
            >
              Next: Asset Gallery
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Assets */}
      {formStep === 4 && (
        <div className="space-y-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(212,255,0,0.5)]" />
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Asset Configuration</h3>
          </div>

          {/* Main Image & Video Intro */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Visual Identification & Intro</h4>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <Input
                  label="Featured Asset Link (URL)"
                  type="url"
                  placeholder="https://example.com/main-image.jpg"
                  {...register('image', {
                    onChange: (e) => setPreviewImage(e.target.value)
                  })}
                  error={errors.image?.message}
                />

                <Input
                  label="Video Intro Link (YouTube/Vimeo)"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  {...register('videoUrl')}
                  error={errors.videoUrl?.message}
                />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest">
                    <span className="bg-zinc-950 px-3 text-zinc-600">Protocol Interface</span>
                  </div>
                </div>

                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-zinc-600 mb-2 group-hover:text-primary transition-colors" />
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest group-hover:text-zinc-300">Direct Upload</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const loadingToast = toast.loading('Uploading main asset...');
                          try {
                            const { url } = await adminApi.uploadServiceImage(file);
                            setValue('image', url, { shouldValidate: true });
                            setPreviewImage(url);
                            toast.success('Asset integrated!', { id: loadingToast });
                          } catch (error: any) {
                            toast.error(`Integration failed: ${error.message}`, { id: loadingToast });
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="w-full md:w-56 h-56 bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center relative group">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => setPreviewImage('')}
                  />
                ) : (
                  <div className="text-center text-zinc-800">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Asset Preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Portfolio Gallery */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Portfolio Gallery</h4>
              <label className="cursor-pointer text-[10px] font-black text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                <Plus size={14} />
                Add Assets
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  accept="image/*"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      const loadingToast = toast.loading(`Uploading ${files.length} assets...`);
                      try {
                        const urls = await adminApi.uploadMultipleImages(files);
                        const currentGallery = watch('gallery') || [];
                        setValue('gallery', [...currentGallery, ...urls], { shouldValidate: true });
                        toast.success('Portfolio updated!', { id: loadingToast });
                      } catch (error: any) {
                        toast.error('Batch upload failed', { id: loadingToast });
                      }
                    }
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(watch('gallery') || []).map((url: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 group">
                  <img src={url} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const current = watch('gallery') || [];
                      setValue('gallery', current.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {(watch('gallery') || []).length === 0 && (
                <div className="col-span-full py-8 border-2 border-dashed border-zinc-900 rounded-2xl flex items-center justify-center">
                  <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.3em]">No Gallery Assets</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Meta Tags</h4>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
              {tagFields.length === 0 && <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest italic py-1">No tags deployed</p>}
              {tagFields.map((field: any, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-fade-in"
                >
                  <span>{typeof field === 'string' ? field : field.value}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Add tag (e.g., luxury, premium)"
                className="flex-1"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (tagInput.trim()) {
                      addTag({ value: tagInput.trim() } as any);
                      setTagInput('');
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                className="w-24 h-12 border-zinc-800 text-xs font-black uppercase tracking-widest"
                onClick={() => {
                  if (tagInput.trim()) {
                    addTag({ value: tagInput.trim() } as any);
                    setTagInput('');
                  }
                }}
              >
                Inject
              </Button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-8">
            <Button
              type="button"
              onClick={() => setFormStep(2)}
              variant="secondary"
              className="flex-1 h-12 border-zinc-800 text-xs font-black uppercase tracking-widest"
            >
              Previous Sector
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1 h-12 neon-glow text-xs font-black uppercase tracking-widest"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4" />
                  {isEditing ? 'Syncing...' : 'Deploying...'}
                </div>
              ) : (
                isEditing ? 'Commit Changes' : 'Execute Deployment'
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}

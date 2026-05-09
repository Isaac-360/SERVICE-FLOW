import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon, Clock, ArrowLeft, ShieldCheck, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { getServiceById } from '../../api/servicesApi';
import { bookingSchema, BookingFormValues, TIME_SLOTS } from './bookingSchema';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

import { useDashboardStore } from '../../store/useDashboardStore';
import { createBooking } from '../../api/bookingsApi';
import { useAuthStore } from '../../store/authStore';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addBooking } = useDashboardStore();
  const { user } = useAuthStore();

  const { data: service, isLoading: isServiceLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedTime = watch('timeSlot');

  const onSubmit = async (data: BookingFormValues) => {
    if (!user) {
      toast.error('Authentication required to book services.');
      navigate('/login');
      return;
    }

    if (!service) {
      toast.error('Service data not loaded. Please try again.');
      return;
    }

    try {
      await createBooking({
        serviceId: id!,
        clientId: user.id,
        scheduledDate: data.date,
        timeSlot: data.timeSlot,
        notes: data.notes,
        totalPrice: (service.price) + 5,
        packageId: 'Standard',
        packageDetails: {
          name: 'Standard Protocol',
          price: service.price,
          description: 'Standard implementation briefing.',
          features: ['Quality Assurance', 'Secure Payment']
        } as any,
        briefingAnswers: data.briefingAnswers || {},
      });

      toast.success('Mission deployed! Notification sent to provider.');
      navigate('/booking-success');
    } catch (error: any) {
      toast.error(error.message || 'Failed to process reservation.');
    }
  };

  if (isServiceLoading) return <Loader fullPage />;
  if (!service) return <div className="text-center py-20">Service not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold uppercase tracking-widest">Abort Deployment</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">Mission <span className="text-primary">Kickoff</span></h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Configuring Standard Operations</p>
          </div>

          <Card className="glass border-zinc-800 rounded-4xl">
            <Card.Content className="p-8 space-y-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                
                {/* Dynamic Briefing Form */}
                {service.briefingQuestions && service.briefingQuestions.length > 0 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="text-primary" size={20} />
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Briefing Requirements</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {service.briefingQuestions.map((q: any, idx: number) => (
                        <div key={idx} className="space-y-3">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                            {q.question} {q.required && <span className="text-primary">*</span>}
                          </label>
                          
                          {q.type === 'textarea' ? (
                            <textarea
                              {...register(`briefingAnswers.${q.question}` as any, { required: q.required })}
                              className="w-full min-h-[100px] rounded-xl border border-zinc-800 bg-black/30 p-4 text-xs text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                              placeholder="Detail your requirements..."
                            />
                          ) : q.type === 'select' ? (
                            <select
                              {...register(`briefingAnswers.${q.question}` as any, { required: q.required })}
                              className="w-full h-12 px-4 rounded-xl border border-zinc-800 bg-black/30 text-xs text-white focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                            >
                              <option value="">Select an option</option>
                              {q.options?.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={q.type === 'file' ? 'file' : 'text'}
                              {...register(`briefingAnswers.${q.question}` as any, { required: q.required })}
                              className="w-full h-12 px-4 rounded-xl border border-zinc-800 bg-black/30 text-xs text-white focus:ring-2 focus:ring-primary/20 outline-none"
                              placeholder="Your response..."
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scheduling */}
                <div className="space-y-8 pt-6 border-t border-zinc-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <CalendarIcon size={14} className="text-primary" />
                        Target Date
                      </label>
                      <Input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        {...register('date')}
                        error={errors.date?.message}
                        className="h-12 bg-black/30 border-zinc-800"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        Operation Window
                      </label>
                      <select
                        {...register('timeSlot')}
                        className="w-full h-12 px-4 rounded-xl border border-zinc-800 bg-black/30 text-xs text-white focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                      >
                        <option value="">Select Window</option>
                        {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                   <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-16 text-sm font-black uppercase tracking-widest neon-glow"
                    isLoading={isSubmitting}
                  >
                    Authorize Mission
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <Card className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-4xl overflow-hidden">
            <Card.Header className="border-zinc-900 p-8">
              <h3 className="font-black text-white uppercase tracking-tight text-xl">Summary</h3>
            </Card.Header>
            <Card.Content className="p-8 space-y-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <img src={service.image} className="w-16 h-16 rounded-xl object-cover border border-zinc-800" />
                <div className="flex-1">
                  <h4 className="font-black text-white text-[10px] leading-tight uppercase tracking-tight">{service.title}</h4>
                  <p className="text-primary text-[8px] font-black uppercase tracking-widest mt-1">Tier: Standard</p>
                </div>
              </div>

              <div className="space-y-3 py-6 border-y border-zinc-900">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-500">Service Value</span>
                  <span className="text-white">GHS {service.price}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-500">Security Fee</span>
                  <span className="text-primary">GHS 5.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Est. Total</span>
                <span className="text-3xl font-black text-white tracking-tighter">GHS {(service.price) + 5}</span>
              </div>
            </Card.Content>
            <Card.Footer className="bg-zinc-900/50 border-none p-6 text-center">
               <div className="flex items-center justify-center gap-3 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                  <ShieldCheck size={14} className="text-primary" />
                  <span>Encrypted Protocol</span>
               </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
}

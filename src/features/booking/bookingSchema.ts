import { z } from 'zod';

export const bookingSchema = z.object({
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  notes: z.string().optional(),
  briefingAnswers: z.record(z.string(), z.any()).optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '01:00 PM', '02:00 PM', 
  '03:00 PM', '04:00 PM', '05:00 PM'
];

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { api, ApiError } from '@/lib/api';
import { AppModal } from '@/components/shared';

const baseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please provide at least 10 characters'),
});

const applyToSpeakSchema = baseSchema.extend({
  topic: z.string().min(3, 'Topic is required'),
  abstract: z.string().min(20, 'Please share a brief abstract'),
  preferredTime: z.string().optional(),
});

const volunteerSchema = baseSchema.extend({
  interests: z.string().min(3, 'Tell us how you want to help'),
  availability: z.string().min(3, 'Share when you are available'),
});

const contactSchema = baseSchema.extend({
  subject: z.string().min(3, 'Subject is required'),
});

type ApplyToSpeakForm = z.infer<typeof applyToSpeakSchema>;
type VolunteerForm = z.infer<typeof volunteerSchema>;
type ContactForm = z.infer<typeof contactSchema>;

type FormKind = 'apply_to_speak' | 'volunteer' | 'contact';

type FormModalState = {
  kind: FormKind | null;
};

type PublicFormsProps = {
  openState: FormModalState;
  onClose: () => void;
};

async function submitPublicForm(kind: FormKind, payload: unknown) {
  await api.submitPublicForm({ kind, payload });
}

export const PublicForms = ({ openState, onClose }: PublicFormsProps) => {
  if (!openState.kind) return null;

  if (openState.kind === 'apply_to_speak') {
    return <ApplyToSpeakModal onClose={onClose} />;
  }
  if (openState.kind === 'volunteer') {
    return <VolunteerModal onClose={onClose} />;
  }
  return <ContactTeamModal onClose={onClose} />;
};

type ModalProps = { onClose: () => void };

const ApplyToSpeakModal = ({ onClose }: ModalProps) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyToSpeakForm>({
    resolver: zodResolver(applyToSpeakSchema),
  });

  const onSubmit = async (data: ApplyToSpeakForm) => {
    setStatus(null);
    setLoading(true);
    try {
      await submitPublicForm('apply_to_speak', data);
      setStatus('Thanks! The team has received your speaker application.');
      reset();
      setTimeout(onClose, 1200);
    } catch (e) {
      setStatus(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      open
      onClose={onClose}
      title="Apply to Speak"
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#DADCE0] px-4 py-2 text-sm font-medium text-solid-matte-gray hover:bg-tech-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="apply-to-speak-form"
            disabled={loading}
            className="rounded-md bg-alexandra px-4 py-2 text-sm font-medium text-white hover:bg-[#357AE8] disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </>
      }
    >
      {status && <p className="mb-2 text-xs text-alexandra">{status}</p>}
      <form id="apply-to-speak-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-blackout">Full name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-blackout">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Phone (optional)</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="+234..."
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Talk topic / title</label>
          <input
            type="text"
            {...register('topic')}
            className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="What do you want to speak about?"
          />
          {errors.topic && <p className="mt-1 text-xs text-red-500">{errors.topic.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Short abstract</label>
          <textarea
            {...register('abstract')}
            rows={4}
            className="w-full resize-none border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="Give us a quick overview of your talk."
          />
          {errors.abstract && <p className="mt-1 text-xs text-red-500">{errors.abstract.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">
            Preferred date / time (optional)
          </label>
          <input
            type="text"
            {...register('preferredTime')}
            className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="e.g. Any weekend in May, evenings"
          />
          {errors.preferredTime && (
            <p className="mt-1 text-xs text-red-500">{errors.preferredTime.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Anything else?</label>
          <textarea
            {...register('message')}
            rows={3}
            className="w-full resize-none border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="Share extra context, links, or questions."
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
        </div>
      </form>
    </AppModal>
  );
};

const VolunteerModal = ({ onClose }: ModalProps) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (data: VolunteerForm) => {
    setStatus(null);
    setLoading(true);
    try {
      await submitPublicForm('volunteer', data);
      setStatus('We see you! The team will reach out about volunteer opportunities.');
      reset();
      setTimeout(onClose, 1200);
    } catch (e) {
      setStatus(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      open
      onClose={onClose}
      title="Volunteer with Us"
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#DADCE0] px-4 py-2 text-sm font-medium text-solid-matte-gray hover:bg-tech-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="volunteer-form"
            disabled={loading}
            className="rounded-md bg-alexandra px-4 py-2 text-sm font-medium text-white hover:bg-[#357AE8] disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </>
      }
    >
      {status && <p className="mb-2 text-xs text-alexandra">{status}</p>}
      <form id="volunteer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-blackout">Full name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-blackout">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Phone (optional)</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="+234..."
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">
            How would you like to help?
          </label>
          <textarea
            {...register('interests')}
            rows={3}
            className="w-full resize-none border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="e.g. event operations, graphics, content, technical mentorship..."
          />
          {errors.interests && (
            <p className="mt-1 text-xs text-red-500">{errors.interests.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Availability</label>
          <textarea
            {...register('availability')}
            rows={3}
            className="w-full resize-none border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="e.g. Weekends only, evenings, exam periods are tight, etc."
          />
          {errors.availability && (
            <p className="mt-1 text-xs text-red-500">{errors.availability.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Anything else?</label>
          <textarea
            {...register('message')}
            rows={3}
            className="w-full resize-none border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="Share extra context or links."
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
        </div>
      </form>
    </AppModal>
  );
};

const ContactTeamModal = ({ onClose }: ModalProps) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setStatus(null);
    setLoading(true);
    try {
      await submitPublicForm('contact', data);
      setStatus('Message sent. The core team will get back to you soon.');
      reset();
      setTimeout(onClose, 1200);
    } catch (e) {
      setStatus(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      open
      onClose={onClose}
      title="Contact the Team"
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#DADCE0] px-4 py-2 text-sm font-medium text-solid-matte-gray hover:bg-tech-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="contact-team-form"
            disabled={loading}
            className="rounded-md bg-alexandra px-4 py-2 text-sm font-medium text-white hover:bg-[#357AE8] disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </>
      }
    >
      {status && <p className="mb-2 text-xs text-alexandra">{status}</p>}
      <form id="contact-team-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-blackout">Full name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-blackout">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Phone (optional)</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="+234..."
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Subject</label>
          <select
            {...register('subject')}
            className="w-full border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
          >
            <option value="">Select a subject</option>
            <option value="event-question">Question about an event</option>
            <option value="partnership">Partnership / sponsorship</option>
            <option value="feedback">Feedback about the community</option>
            <option value="other">Something else</option>
          </select>
          {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blackout">Message</label>
          <textarea
            {...register('message')}
            rows={4}
            className="w-full resize-none border border-[#DADCE0] px-3 py-2 text-sm text-blackout focus:outline-none focus:ring-2 focus:ring-alexandra"
            placeholder="Share what you have in mind."
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
        </div>
      </form>
    </AppModal>
  );
};


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { Event, Speaker } from '@/lib/api';
import { cls } from '@/utils';

export default function AdminEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [managingSpeakersFor, setManagingSpeakersFor] = useState<Event | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.getEvents({ limit: 100 });
      setEvents(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!user || !confirm('Delete this event?')) return;
    setActionLoading(eventId);
    try {
      await api.deleteEvent(eventId);
      loadEvents();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NG', { dateStyle: 'medium' });

  return (
    <div className={cls('space-y-6')}>
      <div className={cls('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4')}>
        <h1 className={cls('text-2xl font-semibold text-blackout')}>Events management</h1>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className={cls(
            'px-4 py-2 rounded-lg font-medium bg-alexandra text-white',
            'hover:bg-[#357AE8] transition-colors'
          )}
        >
          Create event
        </button>
      </div>

      {error && (
        <div className={cls('rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-red-700')}>
          {error}
        </div>
      )}

      <section
        className={cls(
          'rounded-xl border border-[#DADCE0] bg-white overflow-hidden',
          'text-blackout'
        )}
      >
        {loading ? (
          <div className={cls('p-8 text-center text-solid-matte-gray')}>Loading...</div>
        ) : events.length === 0 ? (
          <div className={cls('p-8 text-center text-solid-matte-gray')}>
            No events yet. Create one to get started.
          </div>
        ) : (
          <ul className={cls('divide-y divide-[#DADCE0]')}>
            {events.map((ev) => (
              <li key={ev.id} className={cls('p-4 sm:p-5')}>
                <div
                  className={cls(
                    'rounded-xl border border-[#DADCE0] bg-white p-5 shadow-sm',
                    'transition-shadow hover:shadow-md hover:border-alexandra/50'
                  )}
                >
                  <div className={cls('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between')}>
                    <div className={cls('min-w-0')}>
                      <Link
                        href={`/dashboard/events/${ev.id}`}
                        className={cls('text-lg font-medium text-blackout hover:text-alexandra transition-colors')}
                      >
                        {ev.title}
                      </Link>
                      <p className={cls('mt-1 text-sm text-solid-matte-gray')}>
                        {formatDate(ev.date)}
                        {ev.location ? ` · ${ev.location}` : ''}
                        {Array.isArray(ev.speakers) ? ` · ${ev.speakers.length} speakers` : ''}
                      </p>
                      {ev.description && (
                        <p className={cls('mt-3 text-sm text-solid-matte-gray line-clamp-2')}>
                          {ev.description}
                        </p>
                      )}
                    </div>

                    <div className={cls('flex flex-wrap items-center gap-2 sm:justify-end sm:shrink-0')}>
                      <Link
                        href={`/dashboard/events/${ev.id}`}
                        className={cls(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          'border border-[#DADCE0] text-blackout hover:border-alexandra hover:text-alexandra transition-colors'
                        )}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingEvent(ev)}
                        disabled={!!actionLoading}
                        className={cls(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          'border border-[#DADCE0] text-blackout hover:border-alexandra hover:text-alexandra transition-colors',
                          'disabled:opacity-60'
                        )}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setManagingSpeakersFor(ev)}
                        disabled={!!actionLoading}
                        className={cls(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          'border border-[#DADCE0] text-blackout hover:border-[#34A853] hover:text-[#34A853] transition-colors',
                          'disabled:opacity-60'
                        )}
                      >
                        Speakers
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ev.id)}
                        disabled={!!actionLoading}
                        className={cls(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          'border border-red-200 text-red-600 hover:bg-red-50 transition-colors',
                          'disabled:opacity-60'
                        )}
                      >
                        {actionLoading === ev.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showCreateModal && user && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadEvents();
          }}
          onError={(msg) => setError(msg)}
        />
      )}
      {editingEvent && user && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSuccess={() => {
            setEditingEvent(null);
            loadEvents();
          }}
          onError={(msg) => setError(msg)}
        />
      )}
      {managingSpeakersFor && user && (
        <SpeakerManagementModal
          event={managingSpeakersFor}
          onClose={() => {
            setManagingSpeakersFor(null);
            loadEvents();
          }}
        />
      )}
    </div>
  );
}

/* ─── Create Event Modal ─── */
function CreateEventModal({
  onClose,
  onSuccess,
  onError,
}: {
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setSubmitting(true);
    onError('');
    try {
      await api.createEvent({
        title: title.trim(),
        description: description.trim() || null,
        date,
        start_time: startTime,
        end_time: endTime,
        location: location.trim() || null,
        image_url: imageUrl.trim() || null,
      });
      onSuccess();
    } catch (e) {
      onError(e instanceof ApiError ? e.message : 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={cls(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/50 p-4'
      )}
      onClick={onClose}
    >
      <div
        className={cls(
          'bg-white rounded-xl shadow-lg max-w-md w-full p-6',
          'border border-[#DADCE0]'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={cls('text-xl font-semibold text-blackout mb-4')}>Create event</h2>
        <form onSubmit={handleSubmit} className={cls('space-y-4')}>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div className={cls('grid grid-cols-2 gap-4')}>
            <div>
              <label className={cls('block text-sm font-medium text-blackout mb-1')}>Start time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
            </div>
            <div>
              <label className={cls('block text-sm font-medium text-blackout mb-1')}>End time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
            </div>
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Image URL</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div className={cls('flex gap-2 pt-2')}>
            <button type="submit" disabled={submitting} className={cls('px-4 py-2 bg-alexandra text-white font-medium rounded-lg hover:bg-[#357AE8] disabled:opacity-60')}>
              {submitting ? 'Creating...' : 'Create'}
            </button>
            <button type="button" onClick={onClose} className={cls('px-4 py-2 border border-[#DADCE0] rounded-lg font-medium hover:bg-tech-white')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Edit Event Modal ─── */
function EditEventModal({
  event,
  onClose,
  onSuccess,
  onError,
}: {
  event: Event;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description ?? '');
  const [date, setDate] = useState(event.date);
  const [startTime, setStartTime] = useState(
    typeof event.start_time === 'string' && event.start_time.length >= 5
      ? event.start_time.slice(0, 5)
      : '09:00'
  );
  const [endTime, setEndTime] = useState(
    typeof event.end_time === 'string' && event.end_time.length >= 5
      ? event.end_time.slice(0, 5)
      : '17:00'
  );
  const [location, setLocation] = useState(event.location ?? '');
  const [imageUrl, setImageUrl] = useState(event.image_url ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setSubmitting(true);
    onError('');
    try {
      await api.updateEvent(event.id, {
        title: title.trim(),
        description: description.trim() || null,
        date,
        start_time: startTime,
        end_time: endTime,
        location: location.trim() || null,
        image_url: imageUrl.trim() || null,
      });
      onSuccess();
    } catch (e) {
      onError(e instanceof ApiError ? e.message : 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={cls('fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4')}
      onClick={onClose}
    >
      <div
        className={cls('bg-white rounded-xl shadow-lg max-w-md w-full p-6 border border-[#DADCE0]')}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={cls('text-xl font-semibold text-blackout mb-4')}>Edit event</h2>
        <form onSubmit={handleSubmit} className={cls('space-y-4')}>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div className={cls('grid grid-cols-2 gap-4')}>
            <div>
              <label className={cls('block text-sm font-medium text-blackout mb-1')}>Start time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
            </div>
            <div>
              <label className={cls('block text-sm font-medium text-blackout mb-1')}>End time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
            </div>
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Image URL</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra')} />
          </div>
          <div className={cls('flex gap-2 pt-2')}>
            <button type="submit" disabled={submitting} className={cls('px-4 py-2 bg-alexandra text-white font-medium rounded-lg hover:bg-[#357AE8] disabled:opacity-60')}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className={cls('px-4 py-2 border border-[#DADCE0] rounded-lg font-medium hover:bg-tech-white')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Speaker Management Modal ─── */
function SpeakerManagementModal({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  const [speakers, setSpeakers] = useState<Speaker[]>(event.speakers ?? []);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Add speaker form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bio.trim() || !niche.trim()) return;
    setAddLoading(true);
    setError(null);
    try {
      const speaker = await api.addSpeaker(event.id, {
        name: name.trim(),
        bio: bio.trim(),
        topic: topic.trim() || null,
        niche: niche.trim(),
        image_url: imageUrl.trim() || null,
      });
      setSpeakers((prev) => [...prev, speaker]);
      setName('');
      setBio('');
      setTopic('');
      setNiche('');
      setImageUrl('');
      setShowAddForm(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to add speaker');
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemove = async (speakerId: string) => {
    if (!confirm('Remove this speaker?')) return;
    setActionLoading(speakerId);
    setError(null);
    try {
      await api.removeSpeaker(event.id, speakerId);
      setSpeakers((prev) => prev.filter((s) => s.id !== speakerId));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to remove speaker');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div
      className={cls('fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4')}
      onClick={onClose}
    >
      <div
        className={cls(
          'bg-white rounded-xl shadow-lg max-w-lg w-full p-6 border border-[#DADCE0]',
          'max-h-[90vh] overflow-y-auto'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cls('flex items-center justify-between mb-4')}>
          <h2 className={cls('text-xl font-semibold text-blackout')}>
            Speakers &mdash; {event.title}
          </h2>
          <button type="button" onClick={onClose} className={cls('text-solid-matte-gray hover:text-blackout text-xl leading-none')}>&times;</button>
        </div>

        {error && (
          <div className={cls('rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-sm mb-4')}>
            {error}
          </div>
        )}

        {speakers.length === 0 ? (
          <p className={cls('text-sm text-solid-matte-gray mb-4')}>No speakers added yet.</p>
        ) : (
          <ul className={cls('space-y-3 mb-4')}>
            {speakers.map((s) => (
              <li
                key={s.id}
                className={cls(
                  'flex items-start justify-between gap-3 p-3 rounded-lg',
                  'border border-[#DADCE0] bg-tech-white'
                )}
              >
                <div className={cls('min-w-0')}>
                  <p className={cls('font-medium text-blackout')}>{s.name}</p>
                  {s.topic && <p className={cls('text-sm text-solid-matte-gray')}>{s.topic}</p>}
                  <p className={cls('text-xs text-solid-matte-gray mt-1')}>{s.niche}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(s.id)}
                  disabled={actionLoading === s.id}
                  className={cls('text-red-600 hover:underline text-sm font-medium shrink-0 disabled:opacity-60')}
                >
                  {actionLoading === s.id ? '...' : 'Remove'}
                </button>
              </li>
            ))}
          </ul>
        )}

        {showAddForm ? (
          <form onSubmit={handleAdd} className={cls('space-y-3 border-t border-[#DADCE0] pt-4')}>
            <h3 className={cls('font-medium text-blackout')}>Add speaker</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" required className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-alexandra')} />
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-alexandra')} />
            <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Niche/expertise *" required className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-alexandra')} />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio *" required rows={2} className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-alexandra')} />
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-alexandra')} />
            <div className={cls('flex gap-2')}>
              <button type="submit" disabled={addLoading} className={cls('px-4 py-2 bg-alexandra text-white font-medium rounded-lg text-sm hover:bg-[#357AE8] disabled:opacity-60')}>
                {addLoading ? 'Adding...' : 'Add'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className={cls('px-4 py-2 border border-[#DADCE0] rounded-lg text-sm font-medium hover:bg-tech-white')}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className={cls(
              'px-4 py-2 bg-[#34A853] text-white font-medium rounded-lg text-sm',
              'hover:bg-[#2d9249] transition-colors'
            )}
          >
            + Add speaker
          </button>
        )}
      </div>
    </div>
  );
}

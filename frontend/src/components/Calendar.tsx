'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Event interface
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string; // HH:mm format
  endTime?: string;
  type: 'showing' | 'open-house' | 'meeting' | 'inspection' | 'signing' | 'other';
  location?: string;
  description?: string;
  attendees?: string[];
  propertyId?: string;
  propertyTitle?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
  color?: string;
}

// Time slot interface
interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

// Component props
interface CalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotSelect?: (date: Date, time: string) => void;
  selectedDate?: Date;
  view?: 'month' | 'week' | 'day';
  showTimeSlots?: boolean;
  availableSlots?: TimeSlot[];
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
}

// Constants
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Event type colors
const eventTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  showing: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'open-house': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  meeting: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  inspection: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  signing: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

// Default time slots
const defaultTimeSlots: TimeSlot[] = [
  { time: '09:00', label: '9:00 AM', available: true },
  { time: '10:00', label: '10:00 AM', available: true },
  { time: '11:00', label: '11:00 AM', available: true },
  { time: '12:00', label: '12:00 PM', available: true },
  { time: '14:00', label: '2:00 PM', available: true },
  { time: '15:00', label: '3:00 PM', available: true },
  { time: '16:00', label: '4:00 PM', available: true },
  { time: '17:00', label: '5:00 PM', available: true },
  { time: '18:00', label: '6:00 PM', available: true },
];

// Helper functions
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

const isDateDisabled = (date: Date, minDate?: Date, maxDate?: Date, disabledDates?: Date[]): boolean => {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates?.some(d => isSameDay(d, date))) return true;
  return false;
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Event card component
const EventCard = ({
  event,
  onClick,
  compact = false,
}: {
  event: CalendarEvent;
  onClick: () => void;
  compact?: boolean;
}) => {
  const colors = eventTypeColors[event.type] || eventTypeColors.other;
  
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate ${colors.bg} ${colors.text} hover:opacity-80 transition-opacity`}
      >
        {event.startTime && <span className="font-medium">{formatTime(event.startTime)} </span>}
        {event.title}
      </button>
    );
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border ${colors.bg} ${colors.border} hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${colors.text} truncate`}>{event.title}</p>
          {event.startTime && (
            <p className="text-sm text-gray-600 mt-0.5">
              {formatTime(event.startTime)}
              {event.endTime && ` - ${formatTime(event.endTime)}`}
            </p>
          )}
          {event.location && (
            <p className="text-sm text-gray-500 mt-1 truncate flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {event.location}
            </p>
          )}
        </div>
        {event.status && (
          <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
            event.status === 'confirmed' ? 'bg-green-100 text-green-700' :
            event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {event.status}
          </span>
        )}
      </div>
    </motion.button>
  );
};

// Event detail modal
const EventDetailModal = ({
  event,
  onClose,
}: {
  event: CalendarEvent;
  onClose: () => void;
}) => {
  const colors = eventTypeColors[event.type] || eventTypeColors.other;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 ${colors.bg}`}>
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors.text} bg-white/50 capitalize mb-2`}>
                {event.type.replace('-', ' ')}
              </span>
              <h3 className={`text-lg font-semibold ${colors.text}`}>{event.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/30 rounded transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Date and time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {event.date.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {event.startTime && (
                <p className="text-sm text-gray-500">
                  {formatTime(event.startTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </p>
              )}
            </div>
          </div>
          
          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">{event.location}</p>
                <button className="text-sm text-orange-500 hover:underline">Get directions</button>
              </div>
            </div>
          )}
          
          {/* Property */}
          {event.propertyTitle && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">{event.propertyTitle}</p>
                <button className="text-sm text-orange-500 hover:underline">View property</button>
              </div>
            </div>
          )}
          
          {/* Description */}
          {event.description && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          )}
          
          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Attendees</p>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((attendee, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {attendee}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Status */}
          {event.status && (
            <div className={`p-3 rounded-lg ${
              event.status === 'confirmed' ? 'bg-green-50 text-green-700' :
              event.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
              'bg-red-50 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                {event.status === 'confirmed' && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {event.status === 'pending' && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {event.status === 'cancelled' && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium capitalize">{event.status}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {event.status !== 'cancelled' && (
            <button className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors">
              {event.type === 'showing' ? 'Join Showing' : 
               event.type === 'meeting' ? 'Join Meeting' : 
               'View Details'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Time slot picker component
const TimeSlotPicker = ({
  slots,
  selectedTime,
  onSelectTime,
}: {
  slots: TimeSlot[];
  selectedTime?: string;
  onSelectTime: (time: string) => void;
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map(slot => (
        <button
          key={slot.time}
          onClick={() => slot.available && onSelectTime(slot.time)}
          disabled={!slot.available}
          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            !slot.available
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : selectedTime === slot.time
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {slot.label}
        </button>
      ))}
    </div>
  );
};

// Main Calendar component
export default function Calendar({
  events = [],
  onDateSelect,
  onEventClick,
  onTimeSlotSelect,
  selectedDate: propSelectedDate,
  view = 'month',
  showTimeSlots = false,
  availableSlots = defaultTimeSlots,
  minDate,
  maxDate,
  disabledDates,
  className = '',
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(propSelectedDate || null);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState(view);
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Get calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: (Date | null)[] = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    
    return days;
  }, [currentYear, currentMonth]);
  
  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  }, [events]);
  
  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  // Date selection handler
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date, minDate, maxDate, disabledDates)) return;
    
    setSelectedDate(date);
    setSelectedTime(undefined);
    onDateSelect?.(date);
  };
  
  // Time selection handler
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onTimeSlotSelect?.(selectedDate, time);
    }
  };
  
  // Event click handler
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onEventClick?.(event);
  };
  
  // Selected date events
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  }, [selectedDate, getEventsForDate]);
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setCurrentView('month')}
                className={`px-3 py-1.5 text-sm ${
                  currentView === 'month'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`px-3 py-1.5 text-sm ${
                  currentView === 'week'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCurrentView('day')}
                className={`px-3 py-1.5 text-sm ${
                  currentView === 'day'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Day
              </button>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex">
        {/* Calendar grid */}
        <div className="flex-1 p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }
              
              const dateEvents = getEventsForDate(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const disabled = isDateDisabled(date, minDate, maxDate, disabledDates);
              
              return (
                <motion.button
                  key={date.toISOString()}
                  whileHover={{ scale: disabled ? 1 : 1.05 }}
                  whileTap={{ scale: disabled ? 1 : 0.95 }}
                  onClick={() => handleDateClick(date)}
                  disabled={disabled}
                  className={`aspect-square p-1 rounded-lg transition-all ${
                    disabled
                      ? 'cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : isToday(date)
                      ? 'bg-orange-50 text-orange-600 ring-2 ring-orange-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-white' : isToday(date) ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </span>
                    
                    {/* Event indicators */}
                    {dateEvents.length > 0 && (
                      <div className="mt-auto flex justify-center gap-0.5">
                        {dateEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-white' : eventTypeColors[event.type]?.bg || 'bg-gray-300'
                            }`}
                          />
                        ))}
                        {dateEvents.length > 3 && (
                          <span className={`text-[10px] ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                            +{dateEvents.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          {/* Event legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(eventTypeColors).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${colors.bg} ${colors.border} border`} />
                <span className="text-xs text-gray-600 capitalize">{type.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Side panel - Selected date details */}
        {(selectedDate || showTimeSlots) && (
          <div className="w-80 border-l border-gray-200 p-4 bg-gray-50">
            {selectedDate && (
              <>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {selectedDate.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                
                {/* Time slots */}
                {showTimeSlots && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">Select a time</p>
                    <TimeSlotPicker
                      slots={availableSlots}
                      selectedTime={selectedTime}
                      onSelectTime={handleTimeSelect}
                    />
                  </div>
                )}
                
                {/* Events for selected date */}
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      {selectedDateEvents.length} event{selectedDateEvents.length > 1 ? 's' : ''}
                    </p>
                    {selectedDateEvents.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => handleEventClick(event)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">No events scheduled</p>
                    <button className="mt-2 text-sm text-orange-500 hover:underline">
                      Schedule something
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Event detail modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Export types
export type { CalendarEvent, TimeSlot, CalendarProps };

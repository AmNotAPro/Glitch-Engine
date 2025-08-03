import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  User,
  Mail,
  MessageSquare,
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth.tsx';
import toast from 'react-hot-toast';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const MeetingScheduler = ({ isOpen, onClose, onComplete }: MeetingSchedulerProps) => {
  const { user, profile } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'success'>('date');

  // Available time slots (9 AM to 5 PM)
  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: true },
    { time: '12:00', available: true },
    { time: '13:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: true }
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleSubmit = async () => {
    if (!user || !profile || !selectedDate || !selectedTime) {
      toast.error('Please complete all fields');
      return;
    }

    try {
      setLoading(true);

      // Format the date properly for PostgreSQL
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('meetings')
        .insert({
          user_id: user.id,
          user_name: profile.full_name,
          user_email: profile.email,
          meeting_date: formattedDate,
          meeting_time: selectedTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notes: notes.trim() || null,
          status: 'pending'
        });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to schedule meeting');
      }

      toast.success('Meeting request submitted! We\'ll send you a confirmation email soon.');
      
      // Show success step instead of closing immediately
      setStep('success');

    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      toast.error(error.message || 'Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setSelectedDate(null);
    setSelectedTime(null);
    setNotes('');
    setStep('date');
    onClose();
  };

  const handleSuccessClose = () => {
    handleClose();
    if (onComplete) onComplete();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-background-white rounded-card max-w-2xl w-full shadow-card-hover border border-border-light overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-border-light bg-gradient-to-r from-primary-violet to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Schedule Your Meeting</h3>
                  <p className="text-purple-100">Book a 30-minute call with The Glitch Team</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Date Selection */}
              {step === 'date' && (
                <motion.div
                  key="date"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h4 className="text-lg font-bold text-text-primary mb-4">Select a Date</h4>
                  
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-background-beige rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-text-secondary" />
                    </button>
                    <h5 className="text-lg font-semibold text-text-primary">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h5>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-background-beige rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-text-secondary" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {dayNames.map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary">
                        {day}
                      </div>
                    ))}
                    {getDaysInMonth(currentDate).map((date, index) => (
                      <button
                        key={index}
                        onClick={() => date && handleDateSelect(date)}
                        disabled={!date || !isDateAvailable(date)}
                        className={`p-2 text-center text-sm rounded-lg transition-colors ${
                          !date ? 'invisible' :
                          !isDateAvailable(date) ? 'text-gray-300 cursor-not-allowed' :
                          selectedDate && date.toDateString() === selectedDate.toDateString() 
                            ? 'bg-primary-violet text-white' 
                            : 'hover:bg-background-beige text-text-primary'
                        }`}
                      >
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Time Selection */}
              {step === 'time' && (
                <motion.div
                  key="time"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setStep('date')}
                      className="p-1 hover:bg-background-beige rounded transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-text-secondary" />
                    </button>
                    <h4 className="text-lg font-bold text-text-primary">
                      Select a Time for {selectedDate?.toLocaleDateString()}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          !slot.available 
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                            : selectedTime === slot.time
                              ? 'border-primary-violet bg-primary-violet text-white'
                              : 'border-border-light hover:border-primary-violet hover:bg-primary-violet hover:bg-opacity-5'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatTime(slot.time)}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setStep('time')}
                      className="p-1 hover:bg-background-beige rounded transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-text-secondary" />
                    </button>
                    <h4 className="text-lg font-bold text-text-primary">Meeting Details</h4>
                  </div>

                  {/* Meeting Summary */}
                  <div className="bg-background-beige rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-primary-violet" />
                      <span className="font-medium text-text-primary">
                        {selectedDate?.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-primary-violet" />
                      <span className="font-medium text-text-primary">
                        {selectedTime && formatTime(selectedTime)} (30 minutes)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary-violet" />
                      <span className="font-medium text-text-primary">
                        {profile?.full_name} ({profile?.email})
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary-violet" />
                        Additional Notes (Optional)
                      </div>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific topics you'd like to discuss or questions you have..."
                      rows={4}
                      className="w-full px-4 py-3 border border-border-light rounded-button focus:outline-none focus:ring-2 focus:ring-primary-violet focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary-violet hover:bg-primary-violet-dark text-white font-semibold py-3 rounded-button transition-all duration-200 shadow-card hover:shadow-card-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Schedule Meeting
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8"
                >
                  {/* Success Animation */}
                  <motion.div
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2 
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Check className="w-10 h-10 text-green-600" />
                    </motion.div>
                  </motion.div>

                  <motion.h4 
                    className="text-2xl font-bold text-text-primary mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Meeting Scheduled! 🎉
                  </motion.h4>

                  <motion.p 
                    className="text-text-secondary mb-6 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    Your meeting request has been submitted successfully. 
                    We'll send you a confirmation email with the meeting link soon.
                  </motion.p>

                  {/* Meeting Summary */}
                  <motion.div 
                    className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        {selectedDate?.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        {selectedTime && formatTime(selectedTime)} (30 minutes)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        {profile?.full_name}
                      </span>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={handleSuccessClose}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-button transition-all duration-200 shadow-card hover:shadow-card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Perfect! Close
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MeetingScheduler;
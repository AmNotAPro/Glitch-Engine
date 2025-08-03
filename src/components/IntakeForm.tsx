import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  ArrowRight,
  User,
  Building,
  Briefcase,
  Clock,
  MessageSquare,
  CheckCircle,
  Globe,
  Mail,
  UserCheck,
  Play,
  Palette,
  Code,
  Zap,
  Plus,
  Settings,
  TrendingUp,
  BarChart3,
  Target,
  Coffee,
  FileText,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  Smartphone,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useResponsive } from '../providers/ResponsiveProvider';
import { useTransition } from '../providers/AnimationProvider';
import { responsiveTokens } from '../tokens/responsiveTokens';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth.tsx';
import UnifiedButton from './ui/UnifiedButton';
import UnifiedCard from './ui/UnifiedCard';
import toast from 'react-hot-toast';

interface IntakeFormProps {
  onComplete?: () => void;
}

const IntakeForm = ({ onComplete }: IntakeFormProps) => {
  const { user, refreshProfile } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const transition = useTransition('normal');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const [formData, setFormData] = useState({
    // PAGE 1 - Basic Information
    name: '',
    email: '',
    companyUrl: '',
    companyDescription: '',
    role: '',
    
    // PAGE 2 - About the Role
    startupJourney: '',
    roleType: '',
    keyResponsibilities: '',
    languagesRequired: [] as string[],
    skillsExperience: '',
    
    // PAGE 3 - Availability & Duration
    employmentType: '',
    hoursPerWeek: '',
    startDate: '',
    hourlyRate: '',
    
    // PAGE 4 - Additional Info
    workStyle: '',
    biggestChallenge: [] as string[],
    additionalNotes: ''
  });

  const steps = [
    {
      title: "Basic Information",
      icon: User,
      description: "Tell us about you and your company",
      color: "blue"
    },
    {
      title: "About the Role",
      icon: Briefcase,
      description: "Details about the position you're hiring for",
      color: "violet"
    },
    {
      title: "Availability & Duration", 
      icon: Clock,
      description: "When and how much do you need them?",
      color: "green"
    },
    {
      title: "Additional Info",
      icon: MessageSquare,
      description: "Final details and schedule a meeting",
      color: "orange"
    }
  ];

  // PAGE 1 Options
  const roleOptions = [
    { label: "Founder/Co-founder", value: "founder" },
    { label: "CEO", value: "ceo" },
    { label: "CTO", value: "cto" },
    { label: "Marketing Manager", value: "marketing_manager" },
    { label: "Operations Manager", value: "operations_manager" },
    { label: "HR Manager", value: "hr_manager" },
    { label: "Other", value: "other" }
  ];

  // PAGE 2 Options
  const startupJourneyOptions = [
    { label: "Pre-launch (building our product)", icon: Settings },
    { label: "Early-stage (launched but optimizing)", icon: TrendingUp },
    { label: "Growth stage (scaling our user base)", icon: BarChart3 },
    { label: "Post-pivot (changing direction)", icon: Target },
    { label: "Other", icon: Plus }
  ];

  const roleTypeOptions = [
    { label: "Virtual Assistant", icon: UserCheck },
    { label: "Sales Closer", icon: Zap },
    { label: "Video Editor", icon: Play },
    { label: "Graphic Designer", icon: Palette },
    { label: "Web Developer", icon: Code },
    { label: "Other", icon: Plus }
  ];

  const languageOptions = [
    "English", "Dutch", "German", "French", "Other"
  ];

  // PAGE 3 Options
  const employmentTypeOptions = [
    { label: "Full-time", icon: Clock },
    { label: "Part-time", icon: Coffee },
    { label: "Not sure yet", icon: FileText }
  ];

  const startDateOptions = [
    { label: "ASAP", icon: Zap },
    { label: "Within 2 weeks", icon: Calendar },
    { label: "Within 1 month", icon: Calendar },
    { label: "Flexible", icon: Clock }
  ];

  // PAGE 4 Options
  const workStyleOptions = [
    { label: "With a team", icon: Users },
    { label: "Mostly solo", icon: UserCheck },
    { label: "Both", icon: Building }
  ];

  const challengeOptions = [
    { label: "Poor conversion rates", icon: TrendingUp },
    { label: "Unclear messaging or value proposition", icon: MessageSquare },
    { label: "Outdated design or technology", icon: Palette },
    { label: "Inconsistent with brand identity", icon: Eye },
    { label: "Performance or technical issues", icon: AlertTriangle },
    { label: "We don't have a solution in place yet", icon: Plus },
    { label: "Other", icon: FileText }
  ];

  // Custom Meeting Scheduler Data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to submit the form');
      return;
    }

    try {
      setLoading(true);

      // Create job posting
      const jobData = {
        user_id: user.id,
        title: formData.roleType || 'New Position',
        description: formData.keyResponsibilities || 'No description provided',
        requirements: formData.languagesRequired,
        employment_type: formData.employmentType,
        status: 'active',
        // Additional fields from the complete form
        startup_journey: formData.startupJourney,
        skills_experience: formData.skillsExperience,
        hours_per_week: formData.hoursPerWeek,
        start_date: formData.startDate,
        hourly_rate: formData.hourlyRate,
        work_style: formData.workStyle,
        biggest_challenges: formData.biggestChallenge,
        notes: formData.additionalNotes, // Changed from additional_notes to notes
        applicant_name: formData.name,
        applicant_email: formData.email,
        company_url: formData.companyUrl,
        company_description: formData.companyDescription,
        applicant_role: formData.role
      };

      const { data: jobResult, error: jobError } = await supabase
        .from('job_postings')
        .insert([jobData])
        .select('id')
        .single();

      if (jobError) throw jobError;

      // Create meeting if date and time are selected
      if (selectedDate && selectedTime && jobResult) {
        const meetingData = {
          user_id: user.id,
          job_posting_id: jobResult.id,
          meeting_date: selectedDate,
          meeting_time: selectedTime,
          meeting_type: '30 Minute Meeting',
          status: 'pending',
          notes: 'Initial consultation meeting'
        };

        const { error: meetingError } = await supabase
          .from('meetings')
          .insert([meetingData]);

        if (meetingError) {
          console.error('Meeting creation error:', meetingError);
          // Don't fail the whole process if meeting creation fails
        }
      }

      // Update user profile status
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ 
          hiring_status: 'Job Posting',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast.success('Job posting created successfully! 🎉');
      
      // Refresh profile to update status
      if (refreshProfile) {
        await refreshProfile();
      }

      // Complete the form
      if (onComplete) {
        onComplete();
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languagesRequired: prev.languagesRequired.includes(language)
        ? prev.languagesRequired.filter(l => l !== language)
        : [...prev.languagesRequired, language]
    }));
  };

  const toggleChallenge = (challenge: string) => {
    setFormData(prev => ({
      ...prev,
      biggestChallenge: prev.biggestChallenge.includes(challenge)
        ? prev.biggestChallenge.filter(c => c !== challenge)
        : [...prev.biggestChallenge, challenge]
    }));
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // PAGE 1 - BASIC INFORMATION
  const renderPage1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          About you
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className={`
              w-full px-4 py-3 border border-gray-300 rounded-lg
              ${responsiveTokens.typography['body']}
              focus:ring-2 focus:ring-primary-violet focus:border-transparent
              transition-all duration-200
            `}
          />
          <input
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`
              w-full px-4 py-3 border border-gray-300 rounded-lg
              ${responsiveTokens.typography['body']}
              focus:ring-2 focus:ring-primary-violet focus:border-transparent
              transition-all duration-200
            `}
          />
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          About your company
        </h3>
        <div className="space-y-4">
          <input
            type="url"
            placeholder="Company website URL"
            value={formData.companyUrl}
            onChange={(e) => updateFormData('companyUrl', e.target.value)}
            className={`
              w-full px-4 py-3 border border-gray-300 rounded-lg
              ${responsiveTokens.typography['body']}
              focus:ring-2 focus:ring-primary-violet focus:border-transparent
              transition-all duration-200
            `}
          />
          <textarea
            placeholder="Brief description of your company"
            value={formData.companyDescription}
            onChange={(e) => updateFormData('companyDescription', e.target.value)}
            rows={3}
            className={`
              w-full px-4 py-3 border border-gray-300 rounded-lg resize-none
              ${responsiveTokens.typography['body']}
              focus:ring-2 focus:ring-primary-violet focus:border-transparent
              transition-all duration-200
            `}
          />
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          Your Role
        </h3>
        <select
          value={formData.role}
          onChange={(e) => updateFormData('role', e.target.value)}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg
            ${responsiveTokens.typography['body']}
            focus:ring-2 focus:ring-primary-violet focus:border-transparent
            transition-all duration-200
          `}
        >
          <option value="">Select your role</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  // PAGE 2 - ABOUT THE ROLE
  const renderPage2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          Where are you in your startup journey?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {startupJourneyOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.startupJourney === option.label;
            
            return (
              <motion.button
                key={option.label}
                type="button"
                onClick={() => updateFormData('startupJourney', option.label)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-violet bg-primary-violet/5 text-primary-violet' 
                    : 'border-gray-200 hover:border-gray-300 text-text-secondary'
                  }
                `}
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                transition={transition}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className={responsiveTokens.typography['body-sm']}>
                    {option.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          What role are you hiring for?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roleTypeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.roleType === option.label;
            
            return (
              <motion.button
                key={option.label}
                type="button"
                onClick={() => updateFormData('roleType', option.label)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-violet bg-primary-violet/5 text-primary-violet' 
                    : 'border-gray-200 hover:border-gray-300 text-text-secondary'
                  }
                `}
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                transition={transition}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className={responsiveTokens.typography['body-sm']}>
                    {option.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          What are the key responsibilities?
        </h3>
        <textarea
          placeholder="Describe the main tasks and responsibilities for this role..."
          value={formData.keyResponsibilities}
          onChange={(e) => updateFormData('keyResponsibilities', e.target.value)}
          rows={4}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg resize-none
            ${responsiveTokens.typography['body']}
            focus:ring-2 focus:ring-primary-violet focus:border-transparent
            transition-all duration-200
          `}
        />
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          Any specific languages required?
        </h3>
        <div className="flex flex-wrap gap-3">
          {languageOptions.map((language) => {
            const isSelected = formData.languagesRequired.includes(language);
            
            return (
              <motion.button
                key={language}
                type="button"
                onClick={() => toggleLanguage(language)}
                className={`
                  px-4 py-2 rounded-full border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-violet bg-primary-violet text-white' 
                    : 'border-gray-300 hover:border-gray-400 text-text-secondary'
                  }
                `}
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
                transition={transition}
              >
                <span className={responsiveTokens.typography['body-sm']}>
                  {language}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          What skills or experience are important?
        </h3>
        <textarea
          placeholder="Describe the skills, experience, or qualifications you're looking for..."
          value={formData.skillsExperience}
          onChange={(e) => updateFormData('skillsExperience', e.target.value)}
          rows={4}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg resize-none
            ${responsiveTokens.typography['body']}
            focus:ring-2 focus:ring-primary-violet focus:border-transparent
            transition-all duration-200
          `}
        />
      </div>
    </div>
  );

  // PAGE 3 - AVAILABILITY & DURATION
  const renderPage3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          Is this a full-time or part-time role?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {employmentTypeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.employmentType === option.label;
            
            return (
              <motion.button
                key={option.label}
                type="button"
                onClick={() => updateFormData('employmentType', option.label)}
                className={`
                  p-4 rounded-lg border-2 text-center transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-violet bg-primary-violet/5 text-primary-violet' 
                    : 'border-gray-200 hover:border-gray-300 text-text-secondary'
                  }
                `}
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                transition={transition}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className="w-6 h-6" />
                  <span className={responsiveTokens.typography['body-sm']}>
                    {option.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          Roughly how many hours per week?
        </h3>
        <input
          type="text"
          placeholder="e.g., 40 hours, 20-30 hours, flexible"
          value={formData.hoursPerWeek}
          onChange={(e) => updateFormData('hoursPerWeek', e.target.value)}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg
            ${responsiveTokens.typography['body']}
            focus:ring-2 focus:ring-primary-violet focus:border-transparent
            transition-all duration-200
          `}
        />
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          When do you want this person to start?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {startDateOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.startDate === option.label;
            
            return (
              <motion.button
                key={option.label}
                type="button"
                onClick={() => updateFormData('startDate', option.label)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-violet bg-primary-violet/5 text-primary-violet' 
                    : 'border-gray-200 hover:border-gray-300 text-text-secondary'
                  }
                `}
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                transition={transition}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className={responsiveTokens.typography['body-sm']}>
                    {option.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          What's your preferred hourly rate?
        </h3>
        <input
          type="text"
          placeholder="e.g., $15-25/hour, $500-800/week, negotiable"
          value={formData.hourlyRate}
          onChange={(e) => updateFormData('hourlyRate', e.target.value)}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg
            ${responsiveTokens.typography['body']}
            focus:ring-2 focus:ring-primary-violet focus:border-transparent
            transition-all duration-200
          `}
        />
      </div>
    </div>
  );

  // PAGE 4 - ADDITIONAL INFO
  const renderPage4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          Will the person work with a team or solo?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {workStyleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.workStyle === option.label;
            
            return (
              <motion.button
                key={option.label}
                type="button"
                onClick={() => updateFormData('workStyle', option.label)}
                className={`
                  p-4 rounded-lg border-2 text-center transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-violet bg-primary-violet/5 text-primary-violet' 
                    : 'border-gray-200 hover:border-gray-300 text-text-secondary'
                  }
                `}
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                transition={transition}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className="w-6 h-6" />
                  <span className={responsiveTokens.typography['body-sm']}>
                    {option.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          What's your biggest challenge with your current solution?
        </h3>
        <p className={`${responsiveTokens.typography['body-sm']} text-text-secondary mb-4`}>
          Please select up to three options.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challengeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.biggestChallenge.includes(option.label);
            
            return (
              <motion.button
                key={option.label}
                type="button"
                onClick={() => toggleChallenge(option.label)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-violet bg-primary-violet/5 text-primary-violet' 
                    : 'border-gray-200 hover:border-gray-300 text-text-secondary'
                  }
                `}
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                transition={transition}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className={responsiveTokens.typography['body-sm']}>
                    {option.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          Schedule a Meeting with "The Glitch Team"
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <Calendar className="w-12 h-12 text-primary-violet mx-auto mb-2" />
            <h4 className={`${responsiveTokens.typography['heading-4']} text-text-primary mb-1`}>
              30 Minute Meeting
            </h4>
            <p className={`${responsiveTokens.typography['body-sm']} text-text-secondary`}>
              Walk us through details provided upon confirmation.
            </p>
          </div>

          {/* Custom Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className={`${responsiveTokens.typography['body']} font-semibold text-text-primary`}>
                Select a Day
              </h5>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className={`${responsiveTokens.typography['body-sm']} font-medium`}>
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center py-2">
                  <span className={`${responsiveTokens.typography['caption']} font-medium text-text-secondary`}>
                    {day}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first day of the month */}
              {Array.from({ length: firstDayOfMonth }, (_, index) => (
                <div key={`empty-${index}`} className="p-2"></div>
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDate === dateString;
                const isPast = day < currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
                
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(dateString)}
                    disabled={isPast}
                    className={`
                      p-2 text-center rounded transition-all duration-200
                      ${isSelected 
                        ? 'bg-primary-violet text-white' 
                        : isPast 
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'hover:bg-gray-200 text-text-primary'
                      }
                    `}
                  >
                    <span className={responsiveTokens.typography['body-sm']}>
                      {day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h5 className={`${responsiveTokens.typography['body']} font-semibold text-text-primary mb-3`}>
                Select a Time
              </h5>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`
                        px-3 py-2 rounded border transition-all duration-200
                        ${isSelected 
                          ? 'border-primary-violet bg-primary-violet text-white' 
                          : 'border-gray-300 hover:border-gray-400 text-text-secondary'
                        }
                      `}
                    >
                      <span className={responsiveTokens.typography['body-sm']}>
                        {time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className={`${responsiveTokens.typography['body-sm']} text-green-700`}>
                ✓ Meeting scheduled for {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-4`}>
          Anything else we should know?
        </h3>
        <textarea
          placeholder="Any additional information, special requirements, or questions you'd like to share..."
          value={formData.additionalNotes}
          onChange={(e) => updateFormData('additionalNotes', e.target.value)}
          rows={4}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg resize-none
            ${responsiveTokens.typography['body']}
            focus:ring-2 focus:ring-primary-violet focus:border-transparent
            transition-all duration-200
          `}
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderPage1();
      case 1: return renderPage2();
      case 2: return renderPage3();
      case 3: return renderPage4();
      default: return renderPage1();
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${responsiveTokens.spacing['section-y']}`}>
      {/* Progress Header */}
      <UnifiedCard padding={isMobile ? "sm" : "md"} className="mb-6 sm:mb-8">
        <div className="mb-6 sm:mb-8">
          <h2 className={`${responsiveTokens.typography['heading-1']} text-text-primary mb-2`}>
            Job Intake Form
          </h2>
          <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
            Help us understand your hiring needs
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`
                      w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3
                      ${isActive ? 'bg-primary-violet text-white' : 
                        isCompleted ? 'bg-green-500 text-white' : 
                        'bg-gray-200 text-gray-500'}
                    `}
                    whileHover={!isMobile ? { scale: 1.05 } : {}}
                    transition={transition}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    )}
                  </motion.div>
                  <div className="text-center">
                    <p className={`${responsiveTokens.typography['caption']} font-medium ${
                      isActive ? 'text-primary-violet' : 
                      isCompleted ? 'text-green-500' : 
                      'text-text-secondary'
                    }`}>
                      {isMobile ? `${index + 1}` : step.title}
                    </p>
                    {!isMobile && (
                      <p className={`${responsiveTokens.typography['caption']} text-text-secondary mt-1`}>
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-2 sm:mx-4
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </UnifiedCard>

      {/* Form Content */}
      <UnifiedCard padding={isMobile ? "sm" : "md"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={transition}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <UnifiedButton
            variant="outline"
            size={isMobile ? "sm" : "md"}
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </UnifiedButton>

          {currentStep === steps.length - 1 ? (
            <UnifiedButton
              variant="primary"
              size={isMobile ? "sm" : "md"}
              onClick={handleSubmit}
              loading={loading}
              className="min-w-[120px]"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </UnifiedButton>
          ) : (
            <UnifiedButton
              variant="primary"
              size={isMobile ? "sm" : "md"}
              onClick={handleNext}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </UnifiedButton>
          )}
        </div>
      </UnifiedCard>
    </div>
  );
};

export default IntakeForm;


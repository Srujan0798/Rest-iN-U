import type { Meta, StoryObj } from '@storybook/react';
import { Compass, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

// ============================================================================
// VastuScore Component (Inline for Storybook)
// ============================================================================

interface VastuScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showDetails?: boolean;
  animated?: boolean;
}

const getScoreConfig = (score: number) => {
  if (score >= 90) {
    return {
      label: 'Excellent',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      ringColor: 'stroke-green-500',
      icon: CheckCircle,
      description: 'This property has excellent Vastu compliance',
    };
  }
  if (score >= 75) {
    return {
      label: 'Very Good',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      ringColor: 'stroke-green-400',
      icon: CheckCircle,
      description: 'This property has very good Vastu compliance',
    };
  }
  if (score >= 60) {
    return {
      label: 'Good',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      ringColor: 'stroke-yellow-500',
      icon: Info,
      description: 'This property has good Vastu compliance with minor improvements suggested',
    };
  }
  if (score >= 40) {
    return {
      label: 'Average',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      ringColor: 'stroke-orange-400',
      icon: AlertTriangle,
      description: 'This property has average Vastu compliance and needs some corrections',
    };
  }
  return {
    label: 'Needs Work',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    ringColor: 'stroke-red-400',
    icon: XCircle,
    description: 'This property requires significant Vastu corrections',
  };
};

const VastuScore = ({
  score,
  size = 'md',
  showLabel = true,
  showDetails = false,
  animated = true,
}: VastuScoreProps) => {
  const config = getScoreConfig(score);
  const Icon = config.icon;

  const sizes = {
    sm: {
      container: 'w-16 h-16',
      ring: 48,
      strokeWidth: 4,
      fontSize: 'text-sm',
      iconSize: 'w-3 h-3',
    },
    md: {
      container: 'w-24 h-24',
      ring: 72,
      strokeWidth: 6,
      fontSize: 'text-lg',
      iconSize: 'w-4 h-4',
    },
    lg: {
      container: 'w-32 h-32',
      ring: 96,
      strokeWidth: 8,
      fontSize: 'text-2xl',
      iconSize: 'w-5 h-5',
    },
  };

  const sizeConfig = sizes[size];
  const circumference = 2 * Math.PI * (sizeConfig.ring / 2 - sizeConfig.strokeWidth);
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-2 ${showDetails ? 'p-4 rounded-xl ' + config.bgColor : ''}`}>
      {/* Circular Progress */}
      <div className={`relative ${sizeConfig.container}`}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={sizeConfig.ring / 2 - sizeConfig.strokeWidth}
            fill="none"
            className="stroke-gray-200"
            strokeWidth={sizeConfig.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={sizeConfig.ring / 2 - sizeConfig.strokeWidth}
            fill="none"
            className={`${config.ringColor} ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
            strokeWidth={sizeConfig.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Compass className={`${sizeConfig.iconSize} ${config.color} mb-0.5`} />
          <span className={`font-bold ${config.color} ${sizeConfig.fontSize}`}>
            {score}
          </span>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex items-center gap-1">
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`font-medium ${config.color}`}>{config.label}</span>
        </div>
      )}

      {/* Details */}
      {showDetails && (
        <p className="text-sm text-gray-600 text-center mt-1">
          {config.description}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// VastuScoreBar Component
// ============================================================================

interface VastuScoreBarProps {
  score: number;
  label?: string;
  showPercentage?: boolean;
}

const VastuScoreBar = ({ score, label, showPercentage = true }: VastuScoreBarProps) => {
  const config = getScoreConfig(score);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        {showPercentage && (
          <span className={`text-sm font-semibold ${config.color}`}>{score}%</span>
        )}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            score >= 75 ? 'bg-green-500' :
            score >= 60 ? 'bg-yellow-500' :
            score >= 40 ? 'bg-orange-500' :
            'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// VastuScoreCard Component
// ============================================================================

interface VastuZoneScore {
  zone: string;
  score: number;
  issues?: string[];
}

interface VastuScoreCardProps {
  overallScore: number;
  zones: VastuZoneScore[];
}

const VastuScoreCard = ({ overallScore, zones }: VastuScoreCardProps) => {
  const config = getScoreConfig(overallScore);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start gap-6">
        <VastuScore score={overallScore} size="lg" showLabel showDetails={false} />
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Vastu Analysis</h3>
          <p className="text-sm text-gray-600 mb-4">{config.description}</p>
          
          <div className="space-y-3">
            {zones.map((zone) => (
              <VastuScoreBar key={zone.zone} score={zone.score} label={zone.zone} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Storybook Configuration
// ============================================================================

const meta: Meta<typeof VastuScore> = {
  title: 'Components/VastuScore',
  component: VastuScore,
  tags: ['autodocs'],
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Vastu compliance score (0-100)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the score display',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show text label below score',
    },
    showDetails: {
      control: 'boolean',
      description: 'Show detailed description',
    },
    animated: {
      control: 'boolean',
      description: 'Animate the progress ring',
    },
  },
};

export default meta;
type Story = StoryObj<typeof VastuScore>;

// ============================================================================
// Stories
// ============================================================================

export const Excellent: Story = {
  args: {
    score: 95,
    size: 'md',
    showLabel: true,
  },
};

export const VeryGood: Story = {
  args: {
    score: 82,
    size: 'md',
    showLabel: true,
  },
};

export const Good: Story = {
  args: {
    score: 68,
    size: 'md',
    showLabel: true,
  },
};

export const Average: Story = {
  args: {
    score: 52,
    size: 'md',
    showLabel: true,
  },
};

export const NeedsWork: Story = {
  args: {
    score: 28,
    size: 'md',
    showLabel: true,
  },
};

export const Small: Story = {
  args: {
    score: 85,
    size: 'sm',
    showLabel: false,
  },
};

export const Large: Story = {
  args: {
    score: 85,
    size: 'lg',
    showLabel: true,
  },
};

export const WithDetails: Story = {
  args: {
    score: 75,
    size: 'lg',
    showLabel: true,
    showDetails: true,
  },
};

export const AllScores: Story = {
  render: () => (
    <div className="flex gap-8 flex-wrap">
      <VastuScore score={95} showLabel />
      <VastuScore score={78} showLabel />
      <VastuScore score={62} showLabel />
      <VastuScore score={45} showLabel />
      <VastuScore score={25} showLabel />
    </div>
  ),
};

export const ProgressBars: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <VastuScoreBar score={92} label="Entrance" />
      <VastuScoreBar score={78} label="Kitchen" />
      <VastuScoreBar score={65} label="Master Bedroom" />
      <VastuScoreBar score={45} label="Bathroom" />
      <VastuScoreBar score={88} label="Living Room" />
    </div>
  ),
};

export const ScoreCard: Story = {
  render: () => (
    <div className="max-w-xl">
      <VastuScoreCard
        overallScore={76}
        zones={[
          { zone: 'Entrance', score: 92 },
          { zone: 'Kitchen', score: 78 },
          { zone: 'Master Bedroom', score: 65 },
          { zone: 'Living Room', score: 88 },
          { zone: 'Bathroom', score: 55 },
        ]}
      />
    </div>
  ),
};
bash
mkdir -p /home/claude/dharma-realty/docs
Output
exit code 0

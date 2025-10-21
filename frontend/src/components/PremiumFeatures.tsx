import React from 'react';
import { Crown, Star, Zap, Shield, Users, BarChart3 } from 'lucide-react';

interface PremiumFeaturesProps {
  isPremium: boolean;
  onUpgrade?: () => void;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ isPremium, onUpgrade }) => {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed insights, custom charts, and export capabilities',
      premium: true
    },
    {
      icon: Users,
      title: 'Friend Comparisons',
      description: 'Compare your progress with friends and see detailed stats',
      premium: true
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: '24/7 premium support and early access to new features',
      premium: true
    },
    {
      icon: Zap,
      title: 'XP Boosters',
      description: 'Temporary XP multipliers and special earning opportunities',
      premium: true
    },
    {
      icon: Star,
      title: 'Exclusive Badges',
      description: 'Premium-only badges and achievements',
      premium: true
    },
    {
      icon: Crown,
      title: 'Custom Themes',
      description: 'Premium themes and personalized dashboard layouts',
      premium: true
    }
  ];

  if (isPremium) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <div className="flex items-center mb-4">
          <Crown className="h-8 w-8 mr-3" />
          <h3 className="text-xl font-bold">Premium Active</h3>
        </div>
        <p className="text-purple-100 mb-4">
          You have access to all premium features! Enjoy the enhanced experience.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <feature.icon className="h-5 w-5 mr-2" />
              <span className="text-sm">{feature.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Crown className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Upgrade to Premium</h3>
              <p className="text-sm text-gray-500">Unlock advanced features and insights</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">$9.99</div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <feature.icon className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Crown className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onUpgrade}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            Upgrade Now
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50">
            Learn More
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures;

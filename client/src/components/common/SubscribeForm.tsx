import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { subscribe } from '../../services/subscription.service';

interface SubscribeFormProps {
  className?: string;
  buttonText?: string;
  inputPlaceholder?: string;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({
  className = '',
  buttonText = 'Subscribe',
  inputPlaceholder = 'Enter your email'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      await subscribe(data.email);
      toast.success('Thank you for subscribing!');
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <div className="flex-1">
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          placeholder={inputPlaceholder}
          className={`w-full px-4 py-2 rounded-md border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Subscribing...' : buttonText}
      </button>
    </form>
  );
};

export default SubscribeForm;

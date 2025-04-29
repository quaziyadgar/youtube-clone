import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createChannel } from '../store/channelSlice';

const CreateChannel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.auth);
  const [channelName, setChannelName] = useState('');
  const [formError, setFormError] = useState(null);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!channelName.trim()) {
      setFormError('Channel name is required');
      return;
    }

    try {
      await dispatch(createChannel({ name: channelName })).unwrap();
      setChannelName('');
      navigate('/channel'); // Redirect to homepage or channel page
    } catch (err) {
      setFormError(err || 'Failed to create channel');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-6">Create a Channel</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="channelName" className="block text-sm font-medium text-gray-300 mb-2">
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter channel name"
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {formError && (
            <p className="mt-2 text-sm text-red-400">{formError}</p>
          )}
          {error && status === 'failed' && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {status === 'loading' ? 'Creating...' : 'Create Channel'}
        </button>
      </form>
    </div>
  );
};

export default CreateChannel;
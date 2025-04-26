import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel } from '../store/channelSlice';
import { useNavigate } from 'react-router-dom';

const ChannelForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.channel);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to create a channel');
      navigate('/login');
      return;
    }
    if (name.trim()) {
      dispatch(createChannel({ name }))
        .unwrap()
        .then(() => {
          setName('');
          navigate('/'); // Redirect to home or channel page
        })
        .catch(() => {
          // Error handled by Redux state
        });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-6">Create a Channel</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="channelName" className="block text-sm text-gray-300 mb-2">
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter channel name"
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm text-white disabled:opacity-50"
        >
          {status === 'loading' ? 'Creating...' : 'Create Channel'}
        </button>
      </form>
    </div>
  );
};

export default ChannelForm;
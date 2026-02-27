'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { ArrowLeftIcon, PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  tags: string[];
}

const moodOptions = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'angry', emoji: '😠', label: 'Angry' },
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
];

export default function DiaryPage() {
  const { theme } = useTheme();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const [moodFilter, setMoodFilter] = useState('');

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error parsing diary entries:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save entries to localStorage whenever they change
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }, [entries]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('');
    setTags([]);
    setTagInput('');
    setCurrentEntry(null);
    setIsEditing(false);
  };

  const handleShowForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !mood) {
      alert('Please fill in all required fields');
      return;
    }

    const now = new Date();
    const formattedDate = now.toISOString();

    if (isEditing && currentEntry) {
      // Update existing entry
      const updatedEntries = entries.map(entry => 
        entry.id === currentEntry.id 
          ? { ...entry, title, content, mood, tags, date: formattedDate }
          : entry
      );
      setEntries(updatedEntries);
    } else {
      // Create new entry
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        title,
        content,
        mood,
        date: formattedDate,
        tags,
      };
      setEntries([newEntry, ...entries]);
    }

    setShowForm(false);
    resetForm();
  };

  const handleEdit = (entry: DiaryEntry) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setTags(entry.tags);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const handleViewEntry = (entry: DiaryEntry) => {
    setCurrentEntry(entry);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = filter === '' || 
      entry.title.toLowerCase().includes(filter.toLowerCase()) || 
      entry.content.toLowerCase().includes(filter.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
    
    const matchesMood = moodFilter === '' || entry.mood === moodFilter;
    
    return matchesSearch && matchesMood;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard">
          <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </Link>
        <button
          onClick={handleShowForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300 shadow-md"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Entry
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Personal Diary
        </h1>

        {/* Filters */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 mb-8 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search entries..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:w-1/3">
              <label htmlFor="mood-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Mood
              </label>
              <select
                id="mood-filter"
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Moods</option>
                {moodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Entry Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {isEditing ? 'Edit Entry' : 'New Diary Entry'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Entry title"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts here..."
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mood *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {moodOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setMood(option.value)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border ${
                          mood === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        } transition-colors duration-300`}
                      >
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag"
                      className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    {isEditing ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Entry Detail View */}
        {currentEntry && !showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {currentEntry.title}
                  </h2>
                  <span className="ml-3 text-2xl">
                    {moodOptions.find(m => m.value === currentEntry.mood)?.emoji}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentEntry(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(currentEntry.date)}
              </div>

              <div className="mb-6 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {currentEntry.content}
              </div>

              {currentEntry.tags.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentEntry.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleEdit(currentEntry)}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(currentEntry.id);
                    setCurrentEntry(null);
                  }}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entries List */}
        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEntries.map(entry => (
              <div
                key={entry.id}
                onClick={() => handleViewEntry(entry)}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                    {entry.title}
                  </h3>
                  <span className="text-2xl">
                    {moodOptions.find(m => m.value === entry.mood)?.emoji}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {formatDate(entry.date)}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  {entry.content}
                </p>
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {filter || moodFilter ? 'No entries match your search criteria.' : 'No diary entries yet.'}
            </p>
            <button
              onClick={handleShowForm}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create your first entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const Toolbar = () => {
  const [title, setTitle] = useState('Untitled Sheet');
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveTitle = (e) => {
    if (e.target.value === ""){
        setTitle("Untitled Sheet");
    }
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-gray-100 border-b border-gray-300">
      <div>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveTitle(e);
              }
            }}
            className="px-1 py-1 border border-gray-300 rounded focus:outline-none focus:border-black"
            autoFocus
          />
        ) : (
          <span
            onClick={toggleEdit}
            className="text-black font-semibold text-lg cursor-pointer hover:border hover:border-black hover:rounded hover:px-2 hover:py-1"
          >
            {title}
          </span>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
import React, { SyntheticEvent, useState } from 'react';

import './index.css';

type Props = {
  onSubmit: (name: string) => void;
};

export default function AddUserBar({ onSubmit }: Props) {
  const [name, setName] = useState('');

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit(name);
    setName('');
  }

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="first-name"
        value={name}
        min={1}
        maxLength={10}
        placeholder="Who is in this conversation?"
        onChange={(e) => setName(e.currentTarget.value)}
        required
      />
      <button type="submit" className="btn-add" disabled={!name}>
        Add
      </button>
    </form>
  );
}

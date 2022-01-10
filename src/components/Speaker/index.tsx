import React from 'react';

import './index.css';

import { User } from '../../types';

type Props = {
  talking: boolean;
  time: string;
  user: User;
  onTalking: () => void;
  onInterrupted: () => void;
  onAskedQuestion: () => void;
};

export default function Speaker({ talking, user, onTalking, onInterrupted, onAskedQuestion, time }: Props) {
  return (
    <div className={talking ? 'table-row talking' : 'table-row'} key={user.id}>
      <div className="name">
        <strong>{user.name}</strong>
      </div>
      <button className="btn-is-talking" onClick={onTalking}>
        is talking
      </button>
      <button className="btn-interrupted" onClick={onInterrupted}>
        interrupted: {user.interrupted}
      </button>
      <button className="btn-asked-question" onClick={onAskedQuestion}>
        asked a Q: {user.askedQuestion}
      </button>
      <div className="col-time">{time}</div>
    </div>
  );
}

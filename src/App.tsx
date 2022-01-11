import React, { Component } from 'react';
import Chart from './components/Chart';
import AddUserBar from './components/AddUserBar';
import Speaker from './components/Speaker';

import './App.css';
import { User } from './types';

type State = {
  users: User[];
};

type Props = {};

class App extends Component<Props, State> {
  timer: any;

  state = {
    users: [],
  };

  // Add new user to the array
  handleAddUser(name: string) {
    const users: User[] = this.state.users;

    users.push({
      name,
      id: Date.now(),
      isTalking: false,
      talkingSeconds: 0,
      interrupted: 0,
      askedQuestion: 0,
    });

    this.setState({ users });
  }

  stopAllTimers = () => {
    const { users } = this.state;
    clearInterval(this.timer);

    const talkingUserIndex = users.findIndex((u: User) => u.isTalking);

    if (talkingUserIndex > -1) {
      // @ts-ignore
      users[talkingUserIndex].isTalking = false;
      this.setState({ users });
    }
  };

  startTimer(user: User) {
    this.stopAllTimers();
    let { users } = this.state;

    const talkingUserIndex = users.findIndex((u: User) => u.id === user.id);
    // @ts-ignore
    users[talkingUserIndex] = { ...user, isTalking: true } as User;
    this.setState({ users });

    this.timer = setInterval(() => {
      const freshUser = users[talkingUserIndex];
      // @ts-ignore
      users[talkingUserIndex] = { ...freshUser, talkingSeconds: freshUser.talkingSeconds + 1 };
      this.setState({ users });
    }, 1000);
  }

  convertSecondsToTime = (counter: number): string => {
    const newMill = counter * 1000;
    const minutes = Math.floor(newMill / 60000);
    const seconds = ((newMill % 60000) / 1000).toFixed(0);
    return (minutes < 10 ? '0' + minutes : minutes) + ':' + ((seconds as any) < 10 ? '0' : '') + seconds;
  };

  handleInterrupted(user: User) {
    this.startTimer({ ...user, interrupted: user.interrupted + 1 });
  }

  handleAskedQuestion(user: User) {
    this.startTimer({ ...user, askedQuestion: user.askedQuestion + 1 });
  }

  renderCharts() {
    const { users } = this.state;

    if (!users.length) {
      return null;
    }

    const labels = users.map(({ name }) => name);
    const allSeconds = users.reduce((prev: number, current: User) => {
      return prev + current.talkingSeconds;
    }, 0);

    const timeChartProps = {
      labels,
      dataSetData: users.map((user: User) => {
        if (user.talkingSeconds) {
          return Math.round((user.talkingSeconds * 100) / allSeconds);
        } else {
          return 0;
        }
      }),
      backgroundColor: '#cccccc',
      chartLabel: 'Time %',
    };

    const interruptedChartProps = {
      labels,
      dataSetData: users.map(({ interrupted }) => interrupted),
      backgroundColor: '#f3aa5d',
      chartLabel: 'Interruptions',
    };

    const askedQuestionProps = {
      labels,
      dataSetData: users.map(({ askedQuestion }) => askedQuestion),
      backgroundColor: '#4a86e8',
      chartLabel: 'Questions',
    };

    return (
      <div className="charts">
        <Chart {...timeChartProps} />
        <Chart {...interruptedChartProps} />
        <Chart {...askedQuestionProps} />
      </div>
    );
  }

  render() {
    const { users } = this.state;

    return (
      <div className="page-wrapper">
        <div className="container">
          <AddUserBar onSubmit={(name) => this.handleAddUser(name)} />
          <div className="table-wrapper">
            {users.map((user: User) => (
              <Speaker
                talking={user.isTalking}
                user={user}
                key={user.id}
                onTalking={() => this.startTimer(user)}
                onInterrupted={() => this.handleInterrupted(user)}
                onAskedQuestion={() => this.handleAskedQuestion(user)}
                time={user.talkingSeconds ? this.convertSecondsToTime(user.talkingSeconds) : '00:00'}
              />
            ))}
          </div>
          {users.length ? (
            <button className="btn btn-stop-all-timers" onClick={this.stopAllTimers}>
              STOP ALL TIMERS
            </button>
          ) : null}
        </div>
        {this.renderCharts()}
      </div>
    );
  }
}

export default App;

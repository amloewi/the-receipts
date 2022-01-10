import React, { SyntheticEvent, Component } from 'react';
import './App.css';
import Chart from './components/Chart';
import AddUserBar from './components/AddUserBar';
import Speaker from './components/Speaker';

import { User } from './types';

type State = {
  users: User[];
  currentUserIndex: number;
  time: Array<number>;
  currentUserElement: any;
  currentTalkingUserIndex: null | number;
  ddTimeIndexStart: null | number;
  ddTimeIndexFin: null | number;
};

type Props = {};

class App extends Component<Props, State> {
  timer: any;

  state = {
    name: '',
    users: [],
    currentUserIndex: 1,
    time: [],
    currentUserElement: null,
    currentTalkingUserIndex: null,
    ddTimeIndexStart: null,
    ddTimeIndexFin: null,
    showMyComponent: true,
  };

  // Add new user to the array
  handleAddUser(name: string) {
    const newUsers: User[] = [...this.state.users];
    const newTime: Array<number> = [...this.state.time];

    newUsers.push({
      name,
      id: Date.now(),
      order: newUsers.length + 1,
      interrupted: 0,
      askedQuestion: 0,
    });

    newTime.push(0);

    this.setState({
      users: newUsers,
      time: [...newTime],
    });
  }

  handleStopAllTimers() {
    clearInterval(this.timer);
  }

  startTimer(index: number) {
    clearInterval(this.timer);
    this.setState({ currentTalkingUserIndex: index });

    this.timer = setInterval(() => {
      const { time } = this.state;

      // @ts-ignore
      time[index] = (time[index] || 0) + 1;

      this.setState({ time });
    }, 1000);
  }

  secondsToTime = (counter: number): string => {
    const newMill = counter * 1000;
    const minutes = Math.floor(newMill / 60000);
    const seconds = ((newMill % 60000) / 1000).toFixed(0);
    return (minutes < 10 ? '0' + minutes : minutes) + ':' + ((seconds as any) < 10 ? '0' : '') + seconds;
  };

  handleTalking(index: number) {
    this.startTimer(index);
  }

  handleInterrupted(user: User) {
    const { users }: { users: User[] } = this.state;
    const index = users.indexOf(user);
    this.startTimer(index);

    const newUser = { ...user, interrupted: user.interrupted + 1 };
    users[index] = newUser;

    this.setState({ users });
  }

  handleAskedQuestion(user: User) {
    const { users }: { users: User[] } = this.state;
    const index = users.indexOf(user);
    this.startTimer(index);

    const newUser = { ...user, askedQuestion: user.askedQuestion + 1 };
    users[index] = newUser;

    this.setState({ users });
  }

  render() {
    const { users, time, currentTalkingUserIndex } = this.state;

    const labels = users.sort((a: any, b: any) => (a.order > b.order ? 1 : -1)).map(({ name }) => name);
    const allSeconds = time.reduce((prev, current) => {
      return prev + current;
    }, 0);

    const timeChartProps = {
      labels,
      dataSetData: users.map((user, index) => {
        const seconds = time[index] || 0;
        if (seconds) {
          return Math.round((seconds * 100) / allSeconds);
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
      <div className="page-wrapper">
        <div className="container">
          <AddUserBar onSubmit={(name) => this.handleAddUser(name)} />
          <div className="table-wrapper">
            {users
              .sort((a: any, b: any) => (a.order > b.order ? 1 : -1))
              .map((user: User, index: number) => (
                <Speaker
                  talking={currentTalkingUserIndex === index}
                  user={user}
                  key={user.id}
                  onTalking={() => this.handleTalking(index)}
                  onInterrupted={() => this.handleInterrupted(user)}
                  onAskedQuestion={() => this.handleAskedQuestion(user)}
                  time={time[index] ? this.secondsToTime(time[index]) : '00:00'}
                />
              ))}
          </div>
          {users.length ? (
            <button className="btn btn-stop-all-timers" onClick={() => this.handleStopAllTimers()}>
              STOP ALL TIMERS
            </button>
          ) : null}
        </div>

        {users.length > 0 ? (
          <div className="charts">
            <Chart {...timeChartProps} />
            <Chart {...interruptedChartProps} />
            <Chart {...askedQuestionProps} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;

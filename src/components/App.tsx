import React from 'React';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InfoRequester from './InfoRequester';
import RequestsHistory from './RequestsHistory';
import {RequestRecord} from '../interfaces';

interface Props extends WithStyles<typeof styles> {}

interface State {
  showHistory: boolean;
  requestsHistory: Array<RequestRecord>
}

const styles = createStyles({
  container: {
    backgroundColor: '#BBBBBB',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '98vh',
    overflow: 'hidden',
  },
  historyButton: {
    border: '1px solid #000000',
    backgroundColor: '#BCA52F',
    width: 180,
    height: 60,
    marginTop: 20,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#B29A1F',
    }
  }
});

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showHistory: false,
      requestsHistory: JSON.parse(localStorage.getItem('appRequests')) || []
    };

    this.toggleHistory = this.toggleHistory.bind(this);
    this.updateHistory = this.updateHistory.bind(this);
  }

  toggleHistory(): void {
    this.setState(prevState => {
      return {showHistory: !prevState.showHistory};
    });
  };

  updateHistory(request: RequestRecord): void {
    const currentRequests = JSON.parse(localStorage.getItem('appRequests')) || [];
    currentRequests.push(request);
    this.setState({requestsHistory: currentRequests});
    localStorage.setItem('appRequests', JSON.stringify(currentRequests));
  }

  render(): React.ReactNode {
    const { classes } = this.props;
    const { showHistory, requestsHistory } = this.state;

    return (
      <div className={classes.container}>
        <InfoRequester updateHistory={this.updateHistory}/>
        {requestsHistory.length > 0 &&
          <Button
            className={classes.historyButton}
            onClick={() => this.toggleHistory()}
          >
            {showHistory? 'Скрыть историю запросов' : 'Показать историю запросов'}
          </Button>
        }
        {showHistory && <RequestsHistory requestsHistory={requestsHistory} />}
      </div>
    );
  }
}

export default withStyles(styles)(App);
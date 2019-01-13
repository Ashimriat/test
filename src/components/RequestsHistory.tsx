import React from 'React';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography/Typography';
import ResponseTable from './ResponseTable';
import {RequestRecord} from '../interfaces';

interface Props extends WithStyles<typeof styles> {
  requestsHistory: Array<RequestRecord>
}

interface State {
  currentTab: number;
}

const styles = createStyles({
  historyContainer: {
    marginTop: 5,
    width: '100%',
  },
  recordsContainer: {
    maxHeight: '58vh',
    overflow: 'auto',
  },
  requestPanel: {
    margin: 5,
    border: '1px solid #000000'
  },
  requestPanelHeader: {
    backgroundColor: '#dadada',
    borderBottom: '1px solid #000000',
  },
  requestDate: {
    flexBasis: '33.33%',
  },
  tableCell: {
    border: '1px solid #000000',
  },
  tableHeadCell: {
    backgroundColor: '#dadada',
    color: '#000000',
    fontWeight: 600,
  },
  noRequestsText: {
    padding: '10px 0',
    fontSize: 18,
    fontWeight: 600,
  }
});

class RequestsHistory extends React.Component<Props, State> {
  options: Array<{type: string, name: string}>;
  constructor(props: Props) {
    super(props);

    this.state = {
      currentTab: 0
    };

    this.options = [
      {type: 'GEO', name: 'Запросы к Гео-IP'},
      {type: 'PROVIDER', name: 'Запросы к Провайдер-IP'},
    ];

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab(event, newValue: number): void {
    this.setState({currentTab: newValue});
  };

  renderRequests(): React.ReactNode {
    const { classes, requestsHistory } = this.props;
    const { currentTab } = this.state;

    return requestsHistory ?
      requestsHistory.map((request, index) => {
        if (request.type !== this.options[currentTab].type) return null;
        return (
          <ExpansionPanel
            key={`request-${index}`}
            className={classes.requestPanel}
          >
            <ExpansionPanelSummary
              className={classes.requestPanelHeader}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography className={classes.requestDate}>
                {request.date}
              </Typography>
              <Typography>
                {request.info || 'Ваш IP адресс'}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ResponseTable
                type={currentTab === 0 ? 'GEO' : 'PROVIDER'}
                responseData={request.response}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })
      :
      <Typography
        align={'center'}
        className={classes.noRequestsText}
      >
        {"Запросы отсутствуют"}
      </Typography>
    ;
  }

  render(): React.ReactNode {
    const { classes } = this.props;
    const { currentTab } = this.state;

    return (
      <div className={classes.historyContainer}>
        <AppBar position={'static'}>
          <Tabs
            value={currentTab}
            centered
            onChange={this.changeTab}
          >
            {
              this.options.map((option, index) =>
                <Tab
                  key={`tab-${index}`}
                  label={option.name}
                />
              )
            }
          </Tabs>
        </AppBar>
        <div className={classes.recordsContainer}>
          {this.renderRequests()}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(RequestsHistory);
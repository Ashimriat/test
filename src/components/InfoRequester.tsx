import React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Select from '@material-ui/core/Select/Select';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Typography from '@material-ui/core/Typography/Typography';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import {API, IPV4_PATTERN, IPV4_IPV6_PATTERN} from '../consts';
import {GeoIpData, ProviderIpData} from '../interfaces';
import ResponseTable from './ResponseTable';

interface Props extends WithStyles<typeof styles> {
  updateHistory: Function;
}

interface State {
  menuOpened: boolean;
  requestType: string;
  requestIp: string;
  showResponseInfo: boolean;
  showPreviousRequests: boolean;
  error: string;
  enableSend: boolean;
}

const styles = createStyles({
  inputErrorMessage: {
    color: '#f44336'
  },
  topText: {
    padding: '10px 0',
    fontSize: 18,
    fontWeight: 600,
  },
  closeIcon: {
    fontSize: 22,
    position: 'absolute',
    top: 5,
    right: 5,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  sendButton: {
    border: '1px solid #000000',
    backgroundColor: '#C74433',
    width: 180,
    height: 60,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#9E2D1F',
    }
  },
  dialogPaper: {
    maxWidth: 'inherit',
    padding: '20px 0 40px',
    height: 160,
  },
  requestIpInput: {
    width: 250,
    height: 60,
  }
});

class InfoRequester extends React.Component<Props, State> {
  lastResponse: {type: string; data: GeoIpData | ProviderIpData | string};
  constructor(props: Props) {
    super(props);

    this.state = {
      menuOpened: false,
      requestType: '',
      requestIp: '',
      showResponseInfo: false,
      showPreviousRequests: false,
      error: '',
      enableSend: false
    };

    this.lastResponse = {type: 'error', data: ''};
    this.getInfo = this.getInfo.bind(this);
    this.changeRequestIp = this.changeRequestIp.bind(this);
    this.changeRequestType = this.changeRequestType.bind(this);
    this.toggleTypeMenu = this.toggleTypeMenu.bind(this);
    this.toggleResponseInfo = this.toggleResponseInfo.bind(this);
    this.validateRequestIp = this.validateRequestIp.bind(this);
  }

  getInfo(): void {
    const { updateHistory } = this.props;
    const { requestType, requestIp } = this.state;

    if (this.validateRequestIp()) {
      const request = {
        date: new Date().toLocaleString(),
        type: requestType,
        info: requestIp,
        response: {
          type: '',
          data: null
        }
      };
      const recordRequests = () => {
        this.lastResponse = request.response;
        this.toggleResponseInfo();
        updateHistory(request);
      };
      fetch(API[requestType](requestIp))
        .then(res => res.json())
        .then(res => request.response = {type: 'success', data: res})
        .catch(error => request.response = {type: 'error', data: `Ошибка: ${error}`})
        .then(recordRequests, recordRequests);
    } else {
      this.setState({requestIp: ''});
    }
  }

  toggleResponseInfo(): void {
    this.setState(prevState => {
      return {
        showResponseInfo: !prevState.showResponseInfo
      }
    });
  }

  toggleTypeMenu(): void {
    this.setState(prevState => {
      return {
        menuOpened: !prevState.menuOpened
      }
    })
  }

  changeRequestType(event): void {
    this.setState({
      requestType: event.target.value,
      requestIp: ''
    });
  }

  changeRequestIp(event): void {
    this.setState({requestIp: event.target.value, error: ''});
  }

  validateRequestIp(): boolean {
    const { requestType, requestIp } = this.state;
    if (requestIp.length === 0) return true;
    let pattern = requestType === 'GEO' ? IPV4_IPV6_PATTERN : IPV4_PATTERN,
      errorMessage = requestType === 'GEO' ?
        'IP не соответствует IPv4/IPv6 стандарту'
        :
        'IP не соответствует IPv4 стандарту';
    if (pattern.test(requestIp)) {
      return true;
    } else {
      this.setState({error: errorMessage});
      return false;
    }
  }

  render(): React.ReactNode {
    const { classes } = this.props;
    const { showResponseInfo, requestType, requestIp, error, menuOpened } = this.state;

    return (
      <>
        <Grid
          container
          direction={'column'}
          spacing={16}
          justify={'center'}
          alignItems={'center'}
        >
          <Grid
            item
            container
            direction={'column'}
            xs={3}
            spacing={8}
            alignItems={'center'}
            justify={'center'}
          >
            <Typography className={classes.topText}>
              {'Выберите сервис'}
            </Typography>
            <Select
              open={menuOpened}
              value={requestType}
              onClose={this.toggleTypeMenu}
              onOpen={this.toggleTypeMenu}
              onChange={this.changeRequestType}
              input={
                <OutlinedInput
                  fullWidth
                  labelWidth={0}
                  placeholder={'Выберите сервис'}
                />
              }
            >
              <MenuItem value={'GEO'}>{'Гео-IP (IPv4, IPv6)'}</MenuItem>
              <MenuItem value={'PROVIDER'}>{'Провайдер-IP (IPv4)'}</MenuItem>
            </Select>
          </Grid>
          {requestType &&
            <Grid item>
              <TextField
                className={classes.requestIpInput}
                error={Boolean(error)}
                variant={'outlined'}
                label={'Введите IP или оставьте поле пустым'}
                InputProps={{
                  placeholder: 'IP-адрес'
                }}
                value={requestIp}
                onChange={this.changeRequestIp}
              />
              {error &&
              <FormHelperText className={classes.inputErrorMessage}>
                {error}
              </FormHelperText>
              }
            </Grid>
          }
          {requestType &&
            <Grid item>
              <Button
                disabled={(requestIp.length >= 1 && requestIp.length <= 6) || Boolean(error)}
                className={classes.sendButton}
                onClick={this.getInfo}
              >
                Отправить запрос
              </Button>
            </Grid>
          }
        </Grid>
        <Dialog
          open={showResponseInfo}
          onClose={this.toggleResponseInfo}
          PaperProps={{
            className: classes.dialogPaper
          }}
        >
          <DialogContent>
            <CloseIcon
              className={classes.closeIcon}
              onClick={() => this.toggleResponseInfo()}
            />
            <ResponseTable
              type={requestType}
              responseData={this.lastResponse}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(InfoRequester);
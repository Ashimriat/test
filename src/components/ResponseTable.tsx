import React from 'React';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import classNames from 'classnames';
import {GeoIpData, ProviderIpData} from '../interfaces';
import {GEO_FIELDS, PROVIDER_FIELDS} from '../consts';
import Typography from '@material-ui/core/Typography';

interface Props extends WithStyles<typeof styles> {
  type: string;
  responseData: {
    type: string;
    data: GeoIpData | ProviderIpData | string;
  }
}

const styles = createStyles({
  tableCell: {
    border: '1px solid #000000',
  },
  tableHeadCell: {
    backgroundColor: '#dadada',
    color: '#000000',
    fontWeight: 600,
  }
});

const ResponseTable: React.FunctionComponent<Props> = ({type, responseData, classes}: Props) => {
  const infoFields = type === 'GEO' ? GEO_FIELDS : PROVIDER_FIELDS;
  return responseData.type === 'success' ?
    <Table>
      <TableHead>
        <TableRow>
          {
            infoFields.map((field, index) => {
              return (
                <TableCell
                  key={`headCell-${index}`}
                  align={'center'}
                  className={classNames(classes.tableCell, classes.tableHeadCell)}
                >
                  {field.name}
                </TableCell>
              )
            })
          }
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {
            infoFields.map((field, index) => {
              return (
                <TableCell
                  key={`bodyCell-${index}`}
                  align={'center'}
                  className={classes.tableCell}
                >
                  {responseData.data[field.id] || 'Информация отсутствует'}
                </TableCell>
              )
            })
          }
        </TableRow>
      </TableBody>
    </Table>
    :
    <Typography>
      {responseData.data}
    </Typography>
}

export default withStyles(styles)(ResponseTable);
import * as React from 'react';
import { Typography } from '@material-ui/core';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom'

interface State {

}

// @ts-ignore
interface Props extends RouteComponentProps<Props> {

}

class FooterContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="footer">
        <div className="footer__container">
          <div className="row">
            <div className="col-auto">
              <Typography variant="subtitle1" color="inherit">
                Created by the Software Development Team and Alex Ruffo
              </Typography>
            </div>
            <img src="/img/logo.png" alt="ESSDEV Logo" height="35px" width="28px" />
          </div>
        </div>
        <div className="footer__copyright-bar">
          <Typography variant="body2" color="inherit">
            © 2019 Copyright: Alex Ruffo
          </Typography>
        </div>
      </div>
    );
  }
}

export default withRouter(FooterContainer);

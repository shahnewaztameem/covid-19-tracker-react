import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

import './InfoBox.css';

function Infobox({ title, cases, isRed, active, total, ...props }) {
  return (
    <Card
      className={`infoBox ${active && 'infobox--selected'} ${isRed && 'infobox--red'}`}
      onClick={props.onClick}
    >
      <CardContent>

        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        <h2 className={`infoBox__cases ${!isRed && 'infobox__cases--green'}`}>{cases}</h2>

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>

      </CardContent>

    </Card>
  )
}

export default Infobox

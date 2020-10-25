import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import CountUp from 'react-countup';

import './InfoBox.css';

function Infobox({ title, cases, isRed, active, total, ...props }) {

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(total);
  }, [total])

  return (
    <Card
      className={`infoBox ${active && 'infobox--selected'} ${isRed && 'infobox--red'}`}
      onClick={props.onClick}
    >
      <CardContent>

        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        <h2 className={`infoBox__cases ${!isRed && 'infobox__cases--green'}`}>
          {cases}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          <CountUp start={0} end={totalCount} duration={3} suffix=" Total" />
          {/* {total} Total */}
        </Typography>

      </CardContent>

    </Card>
  )
}

export default Infobox

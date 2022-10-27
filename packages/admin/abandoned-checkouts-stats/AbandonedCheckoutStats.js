import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { ScButton, ScDivider, ScFlex } from '@surecart/components-react';
import Box from '../ui/Box';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';

export default () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [filter, setFilter] = useState('today');

  const getAbandonedData = async() => {
    let startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let endDate = new Date();
    let interval = "day";
    switch (filter) {
      case "yesterday":
        endDate = startDate;
        startDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        break;
      case "lastweek":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "lastmonth":
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        interval = "hour";
        break;
    }
    let startDateObj = new Date(startDate).toISOString();
    let endDateObj = new Date(endDate).toISOString();

    try {
      setError(false);
      setLoading(true);

      const { data } = await apiFetch({
        path: addQueryArgs(`surecart/v1/stats/abandoned_checkouts`, {
          start_at: startDateObj,
          end_at: endDateObj,
          interval: interval
        }),
      });
      setData(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    getAbandonedData();
  }, [filter]);

  console.log(data);

	return (
    <>
      <ScFlex alignItems="center" justifyContent="flex-start">
        <ScButton onClick={() => setFilter('today')} size="small" type={filter === 'today' ? 'default' : 'text'}>{__('Today', 'surecart')}</ScButton>
        <ScButton onClick={() => setFilter('yesterday')} size="small" type={filter === 'yesterday' ? 'default' : 'text'}>{__('Yesterday', 'surecart')}</ScButton>
        <ScButton onClick={() => setFilter('lastweek')} size="small" type={filter === 'lastweek' ? 'default' : 'text'}>{__('Last Week', 'surecart')}</ScButton>
        <ScButton onClick={() => setFilter('lastmonth')} size="small" type={filter === 'lastmonth' ? 'default' : 'text'}>{__('Last Month', 'surecart')}</ScButton>
      </ScFlex>

      <ScDivider style={{ '--spacing': '1em' }} />

      <ScFlex>
        <div style={{'width': '33%'}}>
          <Box title={__('Recoverable Orders', 'surecart')} loading={loading}>
            <h1>84</h1>
            Total Recoverable Orders.
          </Box>
        </div>
        <div style={{'width': '33%'}}>
          <Box title={__('Recovered Orders', 'surecart')} loading={loading}>
            <h1>71</h1>
            Total Recovered Orders.
          </Box>
        </div>
        <div style={{'width': '33%'}}>
          <Box title={__('Recovered Order Recovery Rate', 'surecart')} loading={loading}>
            <h1>42%</h1>
            Total Recovered Order Recovery Rate
          </Box>
        </div>
      </ScFlex>

      <ScDivider style={{ '--spacing': '1em' }} />

      <ScFlex>
        <div style={{'width': '33%'}}>
          <Box title={__('Recoverable Revenue', 'surecart')} loading={loading}>
            <h1>$1,234.56</h1>
            Total Recoverable Revenue
          </Box>
        </div>
        <div style={{'width': '33%'}}>
          <Box title={__('Potential Recovered Revenue', 'surecart')} loading={loading}>
            <h1>$2,345.67</h1>
            Total Recovered Revenue
          </Box>
        </div>
        <div style={{'width': '33%'}}>
          <Box title={__('Potential Recovery Rate', 'surecart')} loading={loading}>
            <h1>30%</h1>
            Total Potential Recovery Rate
          </Box>
        </div>
      </ScFlex>
    </>
  );
};

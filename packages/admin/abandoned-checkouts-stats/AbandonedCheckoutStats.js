import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { ScButton, ScDivider, ScFlex, ScFormatNumber } from '@surecart/components-react';
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

  let recoverableOrderTitle;
  let recoverableOrder;
  let recoveredOrderTitle;
  let recoveredOrder;
  let orderRecoveryTitle;
  let orderRecovery;
  let recoverableRevenueTitle;
  let recoverableRevenue;
  let recoveredRevenueTitle;
  let recoveredRevenue;
  let recoveryRateTitle;
  let recoveryRate;

  if (scData?.entitlements?.licensing) {
    recoverableOrderTitle = __('Recoverable Orders', 'surecart');
    recoverableOrder = data?.[0]?.count ?? 0;
    recoveredOrderTitle = __('Recovered Orders', 'surecart');
    recoveredOrder = data?.[0]?.assisted_count ?? 0;
    orderRecoveryTitle = __('Recovered Order Recovery Rate', 'surecart');
    orderRecovery = data?.[0]?.assisted_rate ?? 0;
    recoverableRevenueTitle = __('Recoverable Revenue', 'surecart');
    recoverableRevenue = data?.[0]?.amount ?? 0;
    recoveredRevenueTitle = __('Recovered Revenue', 'surecart');
    recoveredRevenue = data?.[0]?.assisted_amount ?? 0;
    recoveryRateTitle = __('Recovery Rate', 'surecart');
    recoveryRate = data?.[0]?.assisted_amount_rate ?? 0;
  } else {
    recoverableOrderTitle = __('Recoverable Orders', 'surecart');
    recoverableOrder = data?.[0]?.count ?? 0;
    recoveredOrderTitle = __('Potential Recovered Orders', 'surecart');
    recoveredOrder = data?.[0]?.assisted_count ? data?.[0]?.assisted_count * .18 : 0;
    orderRecoveryTitle = __('Potential Order Recovery Rate', 'surecart');
    orderRecovery = data?.[0]?.assisted_rate ? data?.[0]?.assisted_rate * .18 : 0;
    recoverableRevenueTitle = __('Recoverable Revenue', 'surecart');
    recoverableRevenue = data?.[0]?.amount ?? 0;
    recoveredRevenueTitle = __('Potential Recovered Revenue', 'surecart');
    recoveredRevenue = data?.[0]?.assisted_amount ? data?.[0]?.assisted_amount * .18 : 0;
    recoveryRateTitle = __('Potential Recovery Rate', 'surecart');
    recoveryRate = data?.[0]?.assisted_amount_rate ? data?.[0]?.assisted_amount_rate * .18 : 0;
  }

  useEffect(()=>{
    getAbandonedData();
  }, [filter]);

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
          <Box title={recoverableOrderTitle} loading={loading}>
            <h1>{recoverableOrder}</h1>
            Total Recoverable Orders.
          </Box>
        </div>
        <div style={{'width': '33%'}}>
          <Box title={recoveredOrderTitle} loading={loading}>
            <h1>{recoveredOrder}</h1>
            Total Recovered Orders.
          </Box>
        </div>
        <div style={{'width': '33%'}}>
          <Box title={orderRecoveryTitle} loading={loading}>
            <h1>{orderRecovery}%</h1>
            Total Recovered Order Recovery Rate
          </Box>
        </div>
      </ScFlex>

      <ScDivider style={{ '--spacing': '1em' }} />

      <ScFlex>
        <div style={{'width': '33%'}}>
          <Box title={recoverableRevenueTitle} loading={loading}>
            <h1><ScFormatNumber type='currency' currency='usd' value={recoverableRevenue} /></h1>
            Total Recoverable Revenue
          </Box>
        </div>
        <div style={{'width': '33%'}}>
          <Box title={recoveredRevenueTitle} loading={loading}>
            <h1><ScFormatNumber type='currency' currency='usd' value={recoveredRevenue} /></h1>
            Total Recovered Revenue
          </Box>
        </div>
        <div style={{'width': '33%'}}>
          <Box title={recoveryRateTitle} loading={loading}>
            <h1>{recoveryRate}%</h1>
            Total Recovery Rate
          </Box>
        </div>
      </ScFlex>
    </>
  );
};

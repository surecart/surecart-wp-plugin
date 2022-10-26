import { __ } from '@wordpress/i18n';
import { ScDivider, ScFlex } from '@surecart/components-react';
import Box from '../ui/Box';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';

export default () => {
  const [endDate, setEndDate] = useState(Math.round(+new Date()/1000));
  const [startDate, setStartDate] = useState(
		endDate - (30 * 24 * 60 * 60)
	);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [interval, setInterval] = useState('day');

  const getAbandonedData = async() => {
    try {
      setError(false);
      setLoading(true);

      const { data } = await apiFetch({
        path: addQueryArgs(`surecart/v1/stats/abandoned_checkouts`, {
          start_at: startDate,
          end_at: endDate,
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
  }, []);

  console.log(data);

	return (
    <>
      <ScFlex>
        <Box title={__('Recoverable Orders', 'surecart')} loading={loading}>
          <h1>84</h1>
          Total Recoverable Orders.
        </Box>
        <Box title={__('Recovered Orders', 'surecart')} loading={loading}>
          <h1>71</h1>
          Total Recovered Orders.
        </Box>
        <Box title={__('Recovered Order Recovery Rate', 'surecart')} loading={loading}>
          <h1>42%</h1>
          Total Recovered Order Recovery Rate
        </Box>
      </ScFlex>

      <ScDivider style={{ '--spacing': '1em' }} />

      <ScFlex>
        <Box title={__('Recoverable Revenue', 'surecart')} loading={loading}>
          <h1>$1,234.56</h1>
          Total Recoverable Revenue
        </Box>
        <Box title={__('Potential Recovered Revenue', 'surecart')} loading={loading}>
          <h1>$2,345.67</h1>
          Total Recovered Revenue
        </Box>
        <Box title={__('Potential Recovery Rate', 'surecart')} loading={loading}>
          <h1>30%</h1>
          Total Potential Recovery Rate
        </Box>
      </ScFlex>
    </>
  );
};
